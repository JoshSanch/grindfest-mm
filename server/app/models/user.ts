import mongoose, { Schema, Document } from "mongoose";

export enum UserType {
  Admin,
  Default,
}

export interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  tag: string;
  type: UserType;
  isAdmin: () => boolean;
  toSafeObject: () => IUser;
  equals: (other: IUser) => boolean;
  hashCode: () => number;
}

const UserSchema: Schema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: String,
  tag: { type: String, required: true, default: "anonymous" },
  type: { type: Number, required: true, default: UserType.Default },
});

UserSchema.methods.isAdmin = function () {
  return this.type === UserType.Admin;
};

UserSchema.methods.equals = function (other: IUser) {
  return this.id === other.id;
}

UserSchema.methods.hashCode = function () {
  return parseInt(this.id, 16) | 0;
}

UserSchema.methods.toSafeObject = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
}

UserSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

export default mongoose.model<IUser>("User", UserSchema);
