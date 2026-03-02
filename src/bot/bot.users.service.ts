import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import TelegramBot from 'node-telegram-bot-api';
import { BotDocument, BotUsers } from 'src/schema/bot.users.schema';
import { BOT_INSTANCE } from './bot.provider';

@Injectable()
export class BotUserService {
  private readonly adminId: number = Number(process.env.ADMIN_ID as string);

  private userState = new Map<number, any>();

  /// register finished

  private async showMainMenu(chatId: number) {
    await this.bot.sendMessage(chatId, 'Please can you order 👇', {
      reply_markup: {
        keyboard: [
          [{ text: '🍔 MENU' }],
          [{ text: '🛒 SHOPPING CART' }, { text: '📦 MY ORDERS' }],
          [{ text: '👤 PROFILE' }, { text: '⚙️ SETTINGS' }],
          [{ text: 'ℹ️ ABOUT US' }, { text: '📞 CONTACT US' }],
        ],
        resize_keyboard: true,
      },
    });
  }

  constructor(
    @InjectModel(BotUsers.name) private botUsersSchema: Model<BotDocument>,
    @Inject(BOT_INSTANCE) private readonly bot: TelegramBot,
  ) {
    //
    //  start

    this.bot.onText(/\/start/, async (msg) => {
      const chatId: number = Number(msg.from?.id as number);
      const foundedUser = await this.botUsersSchema.findOne({ chatId });

      if (foundedUser) {
        await this.bot.sendMessage(chatId, 'you are already registered ✅');
        return this.showMainMenu(chatId);
      }

      if (chatId === this.adminId) {
        this.bot.sendMessage(chatId, 'you are a admin');
      }

      this.userState.set(chatId, { step: 'wait_contact' });

      return this.bot.sendMessage(chatId, 'please send you phone number', {
        reply_markup: {
          keyboard: [[{ text: 'send phone number', request_contact: true }]],
          resize_keyboard: true,
          one_time_keyboard: true,
        },
      });
    });

    /// message

    this.bot.on('message', async (msg) => {
      const chatId = Number(msg.from?.id);

      const state = this.userState.get(chatId);

      if (!state) return;

      // ---------- STEP 1 — contact

      if (state.step === 'wait_contact') {
        if (!msg.contact) {
          return this.bot.sendMessage(
            chatId,
            'please send contact using the button',
          );
        }

        this.userState.set(chatId, {
          step: 'wait_location',
          contact: msg.contact.phone_number,
        });

        return this.bot.sendMessage(chatId, 'please send your location', {
          reply_markup: {
            keyboard: [[{ text: 'Send location', request_location: true }]],
            resize_keyboard: true,
            one_time_keyboard: true,
          },
        });
      }

      // ---------- STEP 2 — location

      if (state.step === 'wait_location') {
        if (!msg.location) {
          return this.bot.sendMessage(
            chatId,
            'please send location using the button',
          );
        }

        const latitude = msg.location.latitude;
        const longitude = msg.location.longitude;

        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
        );

        const data = await response.json();

        //
        const address = data.display_name;

        await this.botUsersSchema.create({
          username: msg.from?.first_name || msg.from?.last_name || 'user',
          chatId,
          contact: state.contact,
          adress: address,
        });

        this.userState.delete(chatId);

        this.bot.sendMessage(chatId, 'registration completed ✅', {
          reply_markup: { remove_keyboard: true },
        });
        await this.showMainMenu(chatId);
        return;
      }
    });

    /// ending
  }
}
