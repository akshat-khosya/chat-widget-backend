import { Messages } from "../model";

const createMessages = async (msgData: {
  userId: string;
  sentBy: string;
  message: string;
}) => {
  await Messages.create(msgData);
};
const getMessages = async (userId: string) => {
  return await Messages.find(
    { userId: userId },
    { userId: 1, sentBy: 1, message: 1, updatedAt: 1 }
  );
};
export { createMessages, getMessages };
