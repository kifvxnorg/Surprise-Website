import { pgTable, text, serial, timestamp, date } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const dailyQuotes = pgTable("daily_quotes", {
  id: serial("id").primaryKey(),
  content: text("content").notNull(),
  quoteDate: date("quote_date").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertMessageSchema = createInsertSchema(messages).omit({ 
  id: true,
  createdAt: true
});

export const insertQuoteSchema = createInsertSchema(dailyQuotes).omit({ 
  id: true,
  createdAt: true
});

export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Message = typeof messages.$inferSelect;
export type DailyQuote = typeof dailyQuotes.$inferSelect;
