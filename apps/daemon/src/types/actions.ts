import type z from "zod";

import type { DaemonAction, Prisma } from "@GeoScheduler/daemonDB";
import type { actionPayloadSchema } from "@GeoScheduler/validators";

export const prismaDaemonActionQuery = {};

export type PrismaDaemonAction = Prisma.DaemonActionGetPayload<
    typeof prismaDaemonActionQuery
>;

export type ApiAction = z.infer<typeof actionPayloadSchema>;

export type { DaemonAction };
export type DaemonActionShouldBeExecuted = [DaemonAction, boolean];
