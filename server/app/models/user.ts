import mongoose, { Schema, Document } from "mongoose";

export enum UserType {
  Admin,
  Default,
}

export interface User extends Document {
  email: string;
  password: string;
  name: string;
  tag: string;
  type: UserType;
}

const UserSchema: Schema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: String,
  tag: { type: String, required: true },
  type: { type: Number, required: true },
});

export default mongoose.model<User>('User', UserSchema);
