import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BotUsers, BotUsersSchema } from 'src/schema/bot.users.schema';
import { BotFood, BotFoodSchema } from 'src/schema/bot.foods';
import {
  BotFoodCategory,
  BotFoodCategorySchema,
} from 'src/schema/bot.food.categories';
import { BotOrder, BotOrderSchema } from 'src/schema/bot.order';
import { BotSavedFood, BotSavedFoodSchema } from 'src/schema/bot.saved.food';
import { BotUserService } from './bot.users.service';
import {
  BotRestaurantInfo,
  BotRestaurantInfoSchema,
} from 'src/schema/bot.fast.food.restorance';
import { BotCommandService } from './bot.commands.service';
import { botProvider } from './bot.provider';
import { BotMenuService } from './bot.menu.service';
import { BotCartService } from './bot.cart.service';
import { BotCart, BotCartSchema } from 'src/schema/bot.cart.schema';
import { SeedService } from 'src/seed/seed.service';
import { BotController } from './bot.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: BotUsers.name, schema: BotUsersSchema },
      { name: BotFood.name, schema: BotFoodSchema },
      { name: BotFoodCategory.name, schema: BotFoodCategorySchema },
      { name: BotOrder.name, schema: BotOrderSchema },
      { name: BotSavedFood.name, schema: BotSavedFoodSchema },
      { name: BotRestaurantInfo.name, schema: BotRestaurantInfoSchema },
      { name: BotCart.name, schema: BotCartSchema },
    ]),
  ],
  providers: [
    BotUserService,
    BotCommandService,
    botProvider,
    BotMenuService,
    BotCartService,
    SeedService,
  ],
  controllers: [BotController],
})
export class BotModule {}
