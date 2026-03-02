import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { BotFood } from 'src/schema/bot.foods';
import { BotCart } from 'src/schema/bot.cart.schema';

@Injectable()
export class BotCartService {
  constructor(
    @InjectModel(BotCart.name)
    private readonly cartModel: Model<BotCart>,
    @InjectModel(BotFood.name)
    private readonly foodModel: Model<BotFood>,
  ) {}

  async addToCart(chatId: number, foodId: string) {
    let cart = await this.cartModel.findOne({ chatId });

    if (!cart) {
      cart = await this.cartModel.create({
        chatId,
        items: [{ food: foodId, quantity: 1 }],
      });
      return;
    }

    const existingItem = cart.items.find(
      (item) => item.food.toString() === foodId,
    );

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.items.push({ food: foodId as any, quantity: 1 });
    }

    await cart.save();
  }

  async getCart(chatId: number) {
    return this.cartModel
      .findOne({ chatId })
      .populate('items.food');
  }

  async clearCart(chatId: number) {
    await this.cartModel.deleteOne({ chatId });
  }

  async getTotal(chatId: number) {
    const cart = await this.getCart(chatId);
    if (!cart) return 0;

    let total = 0;

    for (const item of cart.items) {
      const food: any = item.food;
      total += food.price * item.quantity;
    }

    return total;
  }
}