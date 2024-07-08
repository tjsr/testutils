import { IdNamespace } from "./types.js";
import { v5 } from "uuid";

export const NIL_UUID = '00000000-0000-0000-0000-000000000000';

export const createTestRunNamespace = (contextName: string): IdNamespace => {
  return v5(contextName, NIL_UUID);
};
