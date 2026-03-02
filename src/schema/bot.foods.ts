import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

export type BotFoodDocument = BotFood & Document;

@Schema({ timestamps: true, versionKey: false })
export class BotFood {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  image: string;

  @Prop({ required: true, type: Types.ObjectId, ref: 'BotFoodCategory' })
  category: Types.ObjectId;
}

export const BotFoodSchema = SchemaFactory.createForClass(BotFood);
