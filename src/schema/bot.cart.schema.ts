import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class BotCart extends Document {
  @Prop({ type: Number, required: true })
  chatId: number;

  @Prop({
    type: [
      {
        food: { type: Types.ObjectId, ref: 'BotFood' },
        quantity: { type: Number, default: 1 },
      },
    ],
  })
  items: {
    food: Types.ObjectId;
    quantity: number;
  }[];
}

export const BotCartSchema = SchemaFactory.createForClass(BotCart);
