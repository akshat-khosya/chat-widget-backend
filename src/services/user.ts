import { User } from "../model";

const createUser = async (userData: {
  name: string;
  email: string;
  phone: string;
}) => {
  return await User.create(userData);
};

export { createUser };
