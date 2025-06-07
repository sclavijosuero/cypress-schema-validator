import { z } from "zod";

const schema = z.array(

  z.object({
    id: z.string().optional(),
    age: z.number(),
    category: z.object({
      id: z.number(),
      name: z.number().optional(),
      color: z.string()
    }).optional(),
    name: z.number(),
    photoUrls: z.array(z.string()).min(2),
    tags: z.array(z.object({
      id: z.number(),
      name: z.string(),
      type: z.string()
    })).optional(),
    status: z.enum(["available", "sold"]).optional()
  })
)

export default schema;
