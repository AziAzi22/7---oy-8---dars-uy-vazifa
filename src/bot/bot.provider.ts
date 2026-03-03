import TelegramBot from 'node-telegram-bot-api';

export const BOT_INSTANCE = 'BOT_INSTANCE';

export const botProvider = {
  provide: BOT_INSTANCE,
  useFactory: () => {
    return new TelegramBot(process.env.BOT_TOKEN!);
  },
};