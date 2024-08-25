import { z } from "zod";

const appsPayload = z.array(z.string());
//z.enum(["Chrome", "Facebook", "Instagram", "VSCode"]);

export { appsPayload };
