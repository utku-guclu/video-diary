import { z } from 'zod';

export const metadataSchema = z.object({
  title: z.string()
    .min(1, 'Title is required')
    .max(50, 'Title must be less than 50 characters'),
  description: z.string()
    .min(1, 'Description is required')
    .max(500, 'Description must be less than 500 characters')
});

export type MetadataSchema = z.infer<typeof metadataSchema>;

export default metadataSchema;