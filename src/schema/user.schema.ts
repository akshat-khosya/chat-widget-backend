import { object, string, ref, number } from "yup";

const userCreateSchema = object({
  body: object({
    name: string().required("Name is Required"),
    email: string()
      .required("Email is Required")
      .email("Provide a valid Email"),
    phone: string()
      .required("Phone is Required")
      .min(10, "Phone must be at least 10 characters long")
      .max(10, "Phone must be at most 10 characters long"),
  }),
  headers: object({
    "content-type": string()
      .required("Content Type is Required")
      .equals(["application/json"], "Content Type must be application/json"),
  }),
});

export { userCreateSchema };
