import { Request, Response, json } from "express";
import { log } from "../utils";
import { createUser } from "../services/user";

const createUserHandler = async (req: Request, res: Response) => {
  // create user and return user id
  try {
    const user = await createUser({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
    });
    return res
      .status(201)
      .json({ err: false, msg: "User data saved", userId: user.id });
  } catch (error) {
    log.error(JSON.stringify(error.message));
    return res.status(500).json({ err: true, msg: error.message });
  }
};

export { createUserHandler };
