import { Controller, Post, Req } from '@nestjs/common';
import type { Request } from 'express';
import { Inject } from '@nestjs/common';
import TelegramBot from 'node-telegram-bot-api';
import { BOT_INSTANCE } from './bot.provider';

@Controller('bot')
export class BotController {
  constructor(
    @Inject(BOT_INSTANCE) private readonly bot: TelegramBot,
  ) {}

  @Post()
  async handleUpdate(@Req() req: Request) {
    await this.bot.processUpdate(req.body);
    return 'ok';
  }
}