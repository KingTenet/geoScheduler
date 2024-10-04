import { z } from "zod";

const executionStatus = z.enum([
    "WONT_START",
    "STARTED",
    "WONT_FINISH",
    "FINISHED",
    "FAILED",
]);

const actionPayloadSchema = z.object({
    id: z.string(),
    appNames: z.array(z.string()),
    executionStatus: executionStatus.optional(),
    shouldBeExecuted: z.boolean(),
    fromDate: z.date(),
    toDate: z.date(),
});

const allActionPayloadSchema = z.array(actionPayloadSchema);

export { actionPayloadSchema, allActionPayloadSchema };
