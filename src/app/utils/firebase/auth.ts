import { getAuth } from "firebase/auth";
import { app } from "./db";

export const auth = getAuth(app);
