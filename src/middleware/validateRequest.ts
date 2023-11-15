import { AnySchema } from "yup";
import { Request, Response, NextFunction } from "express";
import { log } from "../utils";

const validate =
  (schema: AnySchema) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.validate({
        body: req.body,
        query: req.query,
        params: req.params,
        headers: req.headers,
      });
      return next();
    } catch (e) {
      log.error(e);
      return res.status(400).json({ msg: (e as any).errors });
    }
  };

export default validate;
