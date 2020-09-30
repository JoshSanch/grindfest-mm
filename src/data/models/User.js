import mongoose from 'mongoose';

const { Schema } = mongoose;

const User = new Schema({
  id: String,
  password: String,
  username: String,
  tag: String,
  role: {
    type: String,
    enum: ['admin', 'default'],
  },
});

export default User;
