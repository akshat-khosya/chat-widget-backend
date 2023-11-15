import mongoose from "mongoose";

export interface IMessages {
  userId: string;
  sentBy: string;
  message: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const messagesSchema = new mongoose.Schema<IMessages>(
  {
    userId: {
      type: String,
      required: true,
    },
    sentBy: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Messages = mongoose.model<IMessages>("Messages", messagesSchema);
