import { db } from "./db";
import {
  messages,
  dailyQuotes,
  type InsertMessage,
  type Message,
  type DailyQuote,
} from "@shared/schema";
import { eq } from "drizzle-orm";

export interface IStorage {
  createMessage(message: InsertMessage): Promise<Message>;
  getMessages(): Promise<Message[]>;
  getDailyQuote(date: string): Promise<DailyQuote | undefined>;
  createDailyQuote(quote: { content: string; quoteDate: string }): Promise<DailyQuote>;
}

export class DatabaseStorage implements IStorage {
  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const [message] = await db
      .insert(messages)
      .values(insertMessage)
      .returning();
    return message;
  }

  async getMessages(): Promise<Message[]> {
    return await db.select().from(messages);
  }

  async getDailyQuote(date: string): Promise<DailyQuote | undefined> {
    const [quote] = await db
      .select()
      .from(dailyQuotes)
      .where(eq(dailyQuotes.quoteDate, date));
    return quote;
  }

  async createDailyQuote(quote: { content: string; quoteDate: string }): Promise<DailyQuote> {
    const [newQuote] = await db
      .insert(dailyQuotes)
      .values(quote)
      .returning();
    return newQuote;
  }
}

export const storage = new DatabaseStorage();
