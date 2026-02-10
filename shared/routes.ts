import { z } from "zod";
import { insertMessageSchema, messages, dailyQuotes } from "./schema";

export const api = {
  messages: {
    create: {
      method: "POST" as const,
      path: "/api/messages",
      input: insertMessageSchema,
      responses: {
        201: z.custom<typeof messages.$inferSelect>(),
        400: z.object({ message: z.string() }),
      },
    },
    list: {
      method: "GET" as const,
      path: "/api/messages",
      responses: {
        200: z.array(z.custom<typeof messages.$inferSelect>()),
      },
    },
  },
  quotes: {
    daily: {
      method: "GET" as const,
      path: "/api/quotes/daily",
      responses: {
        200: z.object({ content: z.string() }),
        500: z.object({ message: z.string() }),
      },
    },
  },
};
