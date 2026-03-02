import { Inject, Injectable } from '@nestjs/common';
import { BOT_INSTANCE } from './bot.provider';
import TelegramBot from 'node-telegram-bot-api';
import { InjectModel } from '@nestjs/mongoose';
import { BotFoodCategory } from 'src/schema/bot.food.categories';
import { Model, Types } from 'mongoose';
import { BotFood } from 'src/schema/bot.foods';
import { BotCartService } from './bot.cart.service';
import { BotOrder } from 'src/schema/bot.order';

@Injectable()
export class BotMenuService {
  constructor(
    @Inject(BOT_INSTANCE) private readonly bot: TelegramBot,
    @InjectModel(BotFoodCategory.name)
    private readonly categoryModel: Model<BotFoodCategory>,
    @InjectModel(BotFood.name)
    private readonly foodModel: Model<BotFood>,
    private readonly cartService: BotCartService,

    @InjectModel(BotOrder.name)
    private readonly orderModel: Model<BotOrder>,
  ) {
    // chat

    this.bot.on('callback_query', async (query) => {
      const chatId = Number(query.message?.chat.id as number);
      const data = query.data;

      if (!chatId || !data) return;

      await this.bot.answerCallbackQuery(query.id);

      // when user selected a category

      if (data.startsWith('cat_')) {
        const categoryId = data.split('_')[1];
        return this.showFoodsByCategory(chatId, categoryId, query.id);
      }

      // if user clicked back to categories

      if (data === 'back_to_categories') {
        return this.showCategories(chatId);
      }

      if (data.startsWith('food_')) {
        const foodId = data.split('_')[1];
        return this.showFoodDetails(chatId, foodId);
      }

      // add to cart

      if (data.startsWith('add_')) {
        const foodId = data.split('_')[1];

        await this.cartService.addToCart(chatId, foodId);
        return this.bot.sendMessage(chatId, 'Added to cart 🛒');
      }

      // checkout

      if (data === 'checkout') {
        const cart = await this.cartService.getCart(chatId);
        const total = await this.cartService.getTotal(chatId);

        if (!cart || !cart.items.length)
          return this.bot.sendMessage(chatId, 'Cart is empty');

        // create order
        
        await this.orderModel.create({
          user: chatId,
          items: cart.items,
          totalPrice: total,
          status: 'pending',
          createdAt: new Date(),
        });

        await this.bot.sendMessage(
          chatId,
          `Order placed successfully ✅\nTotal: ${total}$`,
        );

        await this.cartService.clearCart(chatId);
      }
    });
  }

  // showCategories

  async showCategories(chatId: number) {
    const categories = await this.categoryModel.find();

    const buttons = categories.map((c) => [
      {
        text: c.title,
        callback_data: `cat_${c._id}`,
      },
    ]);

    await this.bot.sendMessage(chatId, 'Choose category', {
      reply_markup: {
        inline_keyboard: buttons,
      },
    });
  }

  // showFoodsByCategory

  async showFoodsByCategory(
    chatId: number,
    categoryId: string,
    queryId?: string,
  ) {
    const foods = await this.foodModel.find({
      category: new Types.ObjectId(categoryId),
    });

    if (!foods.length) {
      if (queryId) {
        return this.bot.answerCallbackQuery(queryId, {
          text: 'No products found',
          show_alert: true,
        });
      }
    }

    const buttons = foods.map((f) => [
      {
        text: `${f.title} - ${f.price}$`,
        callback_data: `food_${f._id}`,
      },
    ]);

    buttons.push([{ text: '⬅️ Back', callback_data: 'back_to_categories' }]);

    await this.bot.sendMessage(chatId, 'Choose product:', {
      reply_markup: {
        inline_keyboard: buttons,
      },
    });
  }

  // showFoodDetails

  async showFoodDetails(chatId: number, foodId: string) {
    const food = await this.foodModel.findById(foodId);

    if (!food) return;

    await this.bot.sendPhoto(chatId, food.image, {
      caption: `🍔 ${food.title}

💰 Price: ${food.price}$
📝 ${food.description}`,
      reply_markup: {
        inline_keyboard: [
          [{ text: '🛒 Add to cart', callback_data: `add_${food._id}` }],
          [
            {
              text: '⬅️ Back',
              callback_data: `cat_${food.category.toString()}`,
            },
          ],
        ],
      },
    });
  }

  // END
}
