import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true, versionKey: false })
export class BotRestaurantInfo {
  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop()
  phone: string;

  @Prop()
  email: string;

  @Prop()
  address: string;
}

export const BotRestaurantInfoSchema =
  SchemaFactory.createForClass(BotRestaurantInfo);
