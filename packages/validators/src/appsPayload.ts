import { z } from "zod";

const appsPayload = z.enum(["Chrome", "Facebook", "Instagram", "VSCode"]);

export { appsPayload };
