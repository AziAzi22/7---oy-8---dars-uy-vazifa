import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { OrderMethodEnum } from 'src/enum/order-method.enum';

export type BotDocument = BotUsers & Document;

@Schema({ timestamps: true, versionKey: false })
export class BotUsers {

  @Prop({ required: true })
  username: string;

  @Prop({ required: true, unique: true })
  chatId: number;

  @Prop()
  contact: string;

  @Prop()
  adress: string;
}

export const BotUsersSchema = SchemaFactory.createForClass(BotUsers);
