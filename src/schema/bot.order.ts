import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { OrderMethodEnum } from 'src/enum/order-method.enum';
import { OrderStatusEnum } from 'src/enum/order-status.enum';

@Schema({ timestamps: true })
export class BotOrder {

  @Prop({ type: Types.ObjectId, ref: 'BotUsers', required: true })
  user: Types.ObjectId;

  @Prop([
    {
      food: { type: Types.ObjectId, ref: 'BotFood' },
      quantity: Number,
      price: Number,
    },
  ])
  items: {
    food: Types.ObjectId;
    quantity: number;
    price: number;
  }[];

  @Prop({ required: true })
  totalPrice: number;

  @Prop({ enum: OrderMethodEnum, default: OrderMethodEnum.DELIVERY })
  orderMethod: OrderMethodEnum;

  @Prop({ enum: OrderStatusEnum, default: OrderStatusEnum.PENDING })
  status: OrderStatusEnum;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;
}
export const BotOrderSchema = SchemaFactory.createForClass(BotOrder);
