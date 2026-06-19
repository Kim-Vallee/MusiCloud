import { db } from ".";
import { music } from "./schema";
import { eq } from "drizzle-orm";

export const getAllMusic = () => db.select().from(music).all();
export const getMusicByTitle = (title: string) => db.select().from(music).where(eq(music.title, title)).get();
export const getMusicByAuthor = (author: string) => db.select().from(music).where(eq(music.author, author)).all();
export const getMusicByStyle = (style: string) => db.select().from(music).where(eq(music.style, style)).all();
export const getMusicByBPM = (bpm: number) => db.select().from(music).where(eq(music.bpm, bpm)).get();

// TODO: allow for searching by tags and date
