import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import TelegramBot from 'node-telegram-bot-api';
import { BotRestaurantInfo } from 'src/schema/bot.fast.food.restorance';
import { BotDocument, BotUsers } from 'src/schema/bot.users.schema';
import { BOT_INSTANCE } from './bot.provider';
import { BotMenuService } from './bot.menu.service';
import { BotCartService } from './bot.cart.service';
import { BotOrder } from 'src/schema/bot.order';

@Injectable()
export class BotCommandService {
  private readonly adminId: number = Number(process.env.ADMIN_ID as string);

  private userState = new Map<number, any>();

  constructor(
    @Inject(BOT_INSTANCE) private readonly bot: TelegramBot,

    @InjectModel(BotUsers.name)
    private botUsersSchema: Model<BotDocument>,

    @InjectModel(BotRestaurantInfo.name)
    private botRestaurantInfoSchema: Model<BotRestaurantInfo>,

    @InjectModel(BotOrder.name)
    private readonly orderModel: Model<BotOrder>,

    private readonly cartService: BotCartService,

    private readonly menuService: BotMenuService,
  ) {
    //
    // message

    this.bot.on('message', async (msg) => {
      const text = msg.text;
      const chatId = Number(msg.from?.id);
      const foundedUser = await this.botUsersSchema.findOne({ chatId });

      if (!foundedUser) return;

      if (text === '/start') {
        if (!foundedUser) return;
        return this.menuService.showCategories(chatId);
      }

      // commands

      if (!this.userState.has(chatId)) {
        // menu
 
        if (text === '🍔 MENU') {
          return this.menuService.showCategories(chatId);
        }

        // cart

        if (text === '🛒 SHOPPING CART') {
          const cart = await this.cartService.getCart(chatId);

          if (!cart || !cart.items.length)
            return this.bot.sendMessage(chatId, 'Cart is empty 🛒');

          let message = '🛒 Your cart:\n\n';

          for (const item of cart.items) {
            const food: any = item.food;
            message += `${food.title} x${item.quantity} = ${
              food.price * item.quantity
            }$\n`;
          }

          const total = await this.cartService.getTotal(chatId);

          message += `\n💰 Total: ${total}$`;

          return this.bot.sendMessage(chatId, message, {
            reply_markup: {
              inline_keyboard: [
                [{ text: '🧾 Checkout', callback_data: 'checkout' }],
              ],
            },
          });
        }

        // orders

        if (text === '📦 MY ORDERS') {
          const orders = await this.orderModel.find({
            user: { $eq: chatId },
          } as any);

          if (!orders.length)
            return this.bot.sendMessage(chatId, 'No orders yet 📦');

          let message = '📦 Order history:\n\n';

          for (const order of orders) {
            message += `💰 Total: ${order.totalPrice}$\n`;
            message += `📌 Status: ${order.status}\n\n`;
          }

          return this.bot.sendMessage(chatId, message);
        }

        if (text === '⚙️ SETTINGS') {
          return this.bot.sendMessage(chatId, 'This function is not ready yet');
        }

        // about us

        if (text === 'ℹ️ ABOUT US') {
          const info = await this.botRestaurantInfoSchema.findOne();

          if (!info)
            return this.bot.sendMessage(chatId, 'Restaurant info not found');

          return this.bot.sendMessage(
            chatId,
            `Name: ${info.name}\nDescription: ${info.description}`,
          );
        }

        // contact

        if (text === '📞 CONTACT US') {
          const info = await this.botRestaurantInfoSchema.findOne();

          if (!info)
            return this.bot.sendMessage(chatId, 'Restaurant info not found');

          return this.bot.sendMessage(
            chatId,
            `Phone number: ${info.phone}\nEmail: ${info.email}\nAddress: ${info.address}`,
          );
        }

        // profile

        if (text === '👤 PROFILE') {
          const user = await this.botUsersSchema.findOne({ chatId });

          if (!user) return;

          return this.bot.sendMessage(
            chatId,
            `Name: ${user.username}\nPhone number: ${user.contact}\nAddress: ${user.adress}`,
          );
        }
      }
    });

    ///

    /// ending
  }
}
