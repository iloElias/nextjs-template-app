import axios from "axios";

export interface EmojiData {
  label: string;
  hexcode: string;
  emoji: string;
  text: string;
  type: number;
  version: number;
}

export interface Emoji {
  emoji: string;
  label: string;
  tags: string[];
  hexcode: string;
}

const normalizeLocale = (locale: string): string => {
  const baseLocale = locale.split("-")[0].toLowerCase();
  const supportedLocales = [
    "en", "pt", "es", "fr", "de", "it", "ja", "ko", "zh", "ru", "ar", "hi"
  ];
  return supportedLocales.includes(baseLocale) ? baseLocale : "en";
};

export const fetchEmojis = async (locale: string = "en"): Promise<Emoji[]> => {
  const normalizedLocale = normalizeLocale(locale);
  
  const { data } = await axios.get<EmojiData[]>(
    `https://cdn.jsdelivr.net/npm/emojibase-data@latest/${normalizedLocale}/data.json`
  );

  return data
    .filter((emoji) => emoji.emoji && emoji.label)
    .map((emoji) => ({
      emoji: emoji.emoji,
      label: emoji.label,
      tags: [],
      hexcode: emoji.hexcode,
    }));
};
