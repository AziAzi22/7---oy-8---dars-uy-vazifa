import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ timestamps: true, versionKey: false })
export class BotSavedFood {
  @Prop({ type: Types.ObjectId, ref: 'BotUsers', required: true, unique: true })
  user: Types.ObjectId;

  @Prop([
    {
      food: { type: Types.ObjectId, ref: 'BotFood' },
      quantity: { type: Number, default: 1 },
    },
  ])
  items: {
    food: Types.ObjectId;
    quantity: number;
  }[];

  @Prop({ default: 0 })
  totalPrice: number;
}

export const BotSavedFoodSchema = SchemaFactory.createForClass(BotSavedFood);
