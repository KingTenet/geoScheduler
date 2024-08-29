import { z } from "zod";

const actionPayloadSchema = z.object({
    id: z.string(),
    appNames: z.array(z.string()),
    deletionStatus: z.string().optional(),
    executionStatus: z.string().optional(),
    shouldBeDeleted: z.boolean().optional(),
    fromDate: z.date(),
    toDate: z.date(),
});

const allActionPayloadSchema = z.array(actionPayloadSchema);

export { actionPayloadSchema, allActionPayloadSchema };
