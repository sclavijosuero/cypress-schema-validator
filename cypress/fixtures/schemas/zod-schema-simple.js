import { z } from "zod";

const schema = z.array(
  z.object({
    id: z.string().uuid(),
    name: z.string(),
    age: z.number().int(), // Zod uses `number()` for integers, and `int()` ensures it's an integer.
    email: z.string().email(),
    created_at: z.string().datetime(), // Zod provides `.datetime()` for ISO datetime strings.
    is_active: z.boolean(),
    tags: z.array(z.string()),
    address: z.object({
      street: z.string(),
      city: z.string(),
      postal_code: z.string(),
    }),
    preferences: z
      .object({
        notifications: z.boolean(),
        theme: z.string().optional(), // Optional as it is not marked as required in JSON Schema.
        items_per_page: z.number().int().optional(), // Optional as it is not marked as required.
      })
      .strict(),
  }).strict()
);

export default schema;

