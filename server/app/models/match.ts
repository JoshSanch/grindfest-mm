import mongoose, { Schema, Document } from "mongoose";
import { IUser } from "./user";

export interface IMatch extends Document {
  players: [IUser["id"]];
  timeCreated: Date;
}

const MatchSchema: Schema = new Schema({
  players: [{ type: Schema.Types.ObjectId, ref: "User" }],
  timeCreated: { type: Date, default: Date.now },
});

export default mongoose.model<IMatch>("Match", MatchSchema);
