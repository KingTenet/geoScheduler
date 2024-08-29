import { z } from "zod";

export const placePayloadSchema = z.object({
  id: z.string(),
  name: z.string(),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  radius: z.number().positive(),
  userId: z.string(),
});

export type PlacePayload = z.infer<typeof placePayloadSchema>;

export const createPlaceInputSchema = placePayloadSchema.omit({ id: true, userId: true });

export type CreatePlaceInput = z.infer<typeof createPlaceInputSchema>;