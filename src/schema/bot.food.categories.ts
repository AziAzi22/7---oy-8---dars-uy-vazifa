import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { CategoryTitlesEnum } from 'src/enum/category-titles.enum';

export type BotFoodCategoryDocument = BotFoodCategory & Document;

@Schema({ timestamps: true, versionKey: false })
export class BotFoodCategory {
  @Prop({ required: true })
  title: CategoryTitlesEnum;
}

export const BotFoodCategorySchema =
  SchemaFactory.createForClass(BotFoodCategory);
