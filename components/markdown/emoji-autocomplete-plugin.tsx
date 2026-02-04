"use client";

import { useQuery } from "@tanstack/react-query";
import { useCurrentLocale } from "@/locales/client";
import { EmojiAutocomplete } from "./emoji-autocomplete";
import { fetchEmojis, type Emoji } from "@/http/emojis";

export function EmojiAutocompletePlugin() {
  const locale = useCurrentLocale();
  
  const { data: emojis = [] } = useQuery<Emoji[]>({
    queryKey: ["emojis", locale],
    queryFn: () => fetchEmojis(locale),
    staleTime: Infinity,
  });

  return <EmojiAutocomplete emojis={emojis} />;
}
