"use client";

import { realmPlugin } from "@mdxeditor/editor";
import { addComposerChild$ } from "@mdxeditor/editor";
import { EmojiAutocompletePlugin } from "./emoji-autocomplete-plugin";

export const emojiAutocompletePlugin = realmPlugin({
  init(realm) {
    realm.pubIn({
      [addComposerChild$]: EmojiAutocompletePlugin,
    });
  },
});
