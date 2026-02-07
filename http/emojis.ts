import { normalizeLocale } from "@/lib/utils";
import axios from "axios";

export interface EmojiData {
  label: string;
  hexcode: string;
  emoji: string;
  text: string;
  type: number;
  version: number;
  shortcodes?: string[];
  tags?: string[];
}

export interface Emoji {
  emoji: string;
  label: string;
  tags: string[];
  shortcodes: string[];
  hexcode: string;
}

export const fetchEmojis = async (locale: string = "en"): Promise<Emoji[]> => {
  const normalizedLocale = normalizeLocale(locale);

  const { data } = await axios.get<EmojiData[]>(
    `https://cdn.jsdelivr.net/npm/emojibase-data@latest/${normalizedLocale}/data.json`,
  );

  return data
    .filter((emoji) => emoji.emoji && emoji.label)
    .map((emoji) => ({
      emoji: emoji.emoji,
      label: emoji.label,
      tags: emoji.tags || [],
      shortcodes: emoji.shortcodes || [],
      hexcode: emoji.hexcode,
    }));
};
