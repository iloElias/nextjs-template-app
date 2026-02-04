"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $getSelection,
  $isRangeSelection,
  $isTextNode,
  COMMAND_PRIORITY_HIGH,
  KEY_ARROW_DOWN_COMMAND,
  KEY_ARROW_UP_COMMAND,
  KEY_ENTER_COMMAND,
  KEY_ESCAPE_COMMAND,
  KEY_TAB_COMMAND,
  TextNode,
} from "lexical";
import { mergeRegister } from "@lexical/utils";
import { useScopedI18n } from "@/locales/client";
import { Card, CardBody, CardFooter, Listbox, ListboxItem, cn, Code } from "@heroui/react";
import type { Emoji } from "@/http/emojis";

interface EmojiAutocompleteProps {
  emojis: Emoji[];
}

export function EmojiAutocomplete({ emojis }: EmojiAutocompleteProps) {
  const [editor] = useLexicalComposerContext();
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [position, setPosition] = useState<{ top: number; left: number } | null>(null);
  const triggerNodeRef = useRef<TextNode | null>(null);
  const triggerOffsetRef = useRef<number>(0);
  const selectedItemRef = useRef<HTMLLIElement | null>(null);
  const listboxRef = useRef<HTMLDivElement | null>(null);
  const popupRef = useRef<HTMLDivElement | null>(null);
  const t = useScopedI18n("mdx-editor.emojiPicker");

  const hasEmojis = emojis.length > 0;

  const adjustedPosition = useMemo(() => {
    if (!position || !isOpen) return null;

    const POPUP_WIDTH = 360;
    const POPUP_HEIGHT = 400;
    const SPACING = 8;
    const EDGE_PADDING = 16;

    let { top, left } = position;

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    if (left + POPUP_WIDTH > viewportWidth - EDGE_PADDING) {
      left = viewportWidth - POPUP_WIDTH - EDGE_PADDING;
    }

    if (left < EDGE_PADDING) {
      left = EDGE_PADDING;
    }

    if (top + SPACING + POPUP_HEIGHT > viewportHeight - EDGE_PADDING) {
      top = position.top - POPUP_HEIGHT - SPACING;
    } else {
      top = position.top + SPACING;
    }

    if (top < EDGE_PADDING) {
      top = EDGE_PADDING;
    }

    return { top, left };
  }, [position, isOpen]);

  const filteredEmojis = useMemo(() => {
    if (!search || search.length === 0) return [];
    
    const searchLower = search.toLowerCase();
    
    return emojis
      .filter((emoji) => {
        if (!emoji || !emoji.emoji) return false;
        
        const label = String(emoji.label || '').toLowerCase();
        const labelMatch = label.includes(searchLower);
        
        const tagMatch = Array.isArray(emoji.tags) && emoji.tags.some((tag) => {
          const tagStr = String(tag || '').toLowerCase();
          return tagStr.includes(searchLower);
        });
        
        return labelMatch || tagMatch;
      })
      .slice(0, 10);
  }, [search, emojis]);

  const close = useCallback(() => {
    setIsOpen(false);
    setSearch("");
    setSelectedIndex(0);
    setPosition(null);
    triggerNodeRef.current = null;
  }, []);

  const insertEmoji = useCallback(
    (emoji: Emoji) => {
      const triggerNode = triggerNodeRef.current;
      const triggerOffset = triggerOffsetRef.current;
      
      if (!triggerNode) return;

      editor.update(() => {
        const selection = $getSelection();
        if (!$isRangeSelection(selection)) return;
        
        const node = selection.anchor.getNode();
        if (!$isTextNode(node)) return;

        const textContent = node.getTextContent();
        
        const startPos = triggerOffset;
        const endPos = startPos + search.length + 1;
        
        const beforeEmoji = textContent.substring(0, startPos);
        const afterEmoji = textContent.substring(endPos);
        const newText = beforeEmoji + emoji.emoji + afterEmoji;
        
        node.setTextContent(newText);
        
        const cursorPos = beforeEmoji.length + emoji.emoji.length;
        node.select(cursorPos, cursorPos);
      });

      close();
    },
    [editor, search, close]
  );

  useEffect(() => {
    if (!hasEmojis) return;
    
    const updateListener = editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const selection = $getSelection();
        if (!$isRangeSelection(selection) || !selection.isCollapsed()) {
          if (isOpen) close();
          return;
        }

        const anchor = selection.anchor;
        const node = anchor.getNode();
        
        if (!$isTextNode(node)) {
          if (isOpen) close();
          return;
        }

        const textContent = node.getTextContent();
        const cursorOffset = anchor.offset;

        let colonIndex = -1;
        for (let i = cursorOffset - 1; i >= 0; i--) {
          const char = textContent[i];
          if (char === ":") {
            colonIndex = i;
            break;
          }
          if (char === " " || char === "\n") {
            break;
          }
        }

        if (colonIndex === -1) {
          if (isOpen) close();
          return;
        }

        const searchText = textContent.substring(colonIndex + 1, cursorOffset);

        if (searchText.length === 0) {
          if (isOpen) close();
          return;
        }

        const domSelection = window.getSelection();
        if (!domSelection || domSelection.rangeCount === 0) {
          if (isOpen) close();
          return;
        }

        const range = domSelection.getRangeAt(0);
        const rect = range.getBoundingClientRect();

        setSearch(searchText);
        setSelectedIndex(0);
        setPosition({
          top: rect.bottom,
          left: rect.left,
        });
        triggerNodeRef.current = node;
        triggerOffsetRef.current = colonIndex;
        setIsOpen(true);
      });
    });

    return () => {
      updateListener();
    };
  }, [editor, isOpen, close, hasEmojis]);

  useEffect(() => {
    if (selectedItemRef.current && listboxRef.current) {
      selectedItemRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [selectedIndex]);

  useEffect(() => {
    if (!isOpen || filteredEmojis.length === 0) return;

    return mergeRegister(
      editor.registerCommand(
        KEY_ARROW_DOWN_COMMAND,
        (event) => {
          event?.preventDefault();
          setSelectedIndex((prev) => 
            prev < filteredEmojis.length - 1 ? prev + 1 : prev
          );
          return true;
        },
        COMMAND_PRIORITY_HIGH
      ),
      editor.registerCommand(
        KEY_ARROW_UP_COMMAND,
        (event) => {
          event?.preventDefault();
          setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
          return true;
        },
        COMMAND_PRIORITY_HIGH
      ),
      editor.registerCommand(
        KEY_ENTER_COMMAND,
        (event) => {
          if (filteredEmojis[selectedIndex]) {
            event?.preventDefault();
            insertEmoji(filteredEmojis[selectedIndex]);
            return true;
          }
          return false;
        },
        COMMAND_PRIORITY_HIGH
      ),
      editor.registerCommand(
        KEY_TAB_COMMAND,
        (event) => {
          if (filteredEmojis[selectedIndex]) {
            event?.preventDefault();
            insertEmoji(filteredEmojis[selectedIndex]);
            return true;
          }
          return false;
        },
        COMMAND_PRIORITY_HIGH
      ),
      editor.registerCommand(
        KEY_ESCAPE_COMMAND,
        (event) => {
          event?.preventDefault();
          close();
          return true;
        },
        COMMAND_PRIORITY_HIGH
      )
    );
  }, [editor, isOpen, filteredEmojis, selectedIndex, insertEmoji, close]);

  if (!isOpen || !adjustedPosition) {
    return null;
  }

  if (filteredEmojis.length === 0) {
    if (emojis.length === 0) return null;
    
    return (
      <Card
        ref={popupRef}
        style={{
          position: "fixed",
          top: `${adjustedPosition.top}px`,
          left: `${adjustedPosition.left}px`,
          zIndex: 1000,
          minWidth: "280px",
        }}
        shadow="lg"
        className="animate-appearance-in"
      >
        <CardBody className="py-3">
          <p className="text-default-500 text-small">
            {t("noEmojiFoundFor", { search })}
          </p>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card
      ref={popupRef}
      style={{
        position: "fixed",
        top: `${adjustedPosition.top}px`,
        left: `${adjustedPosition.left}px`,
        zIndex: 1000,
        minWidth: "320px",
        maxWidth: "360px",
      }}
      shadow="lg"
      className="animate-appearance-in"
    >
      <CardBody className="p-2 rounded-large">
        <Listbox
          aria-label="Emoji autocomplete"
          variant="flat"
          selectionMode="single"
          classNames={{
            base: "max-h-80 overflow-y-auto p-0",
            list: "gap-0",
          }}
        >
          {filteredEmojis.map((emoji, index) => (
            <ListboxItem
              key={emoji.hexcode}
              textValue={emoji.label}
              className={cn(
                "p-2 m-1 w-[calc(100%-0.5rem)] overflow-hidden rounded-medium transition-all cursor-pointer truncate hover:bg-default/10",
                index === selectedIndex && "bg-default/20 ring ring-primary",
              )}
              startContent={
                <span className="flex justify-center items-center w-8 h-8 text-2xl shrink-0">
                  {emoji.emoji}
                </span>
              }
              description={
                <Code
                  size="sm"
                  className="max-w-full truncate"
                >
                  :{emoji.label.toLowerCase().replace(/\s+/g, "_")}:
                </Code>
              }
              onClick={() => insertEmoji(emoji)}
              onMouseEnter={() => setSelectedIndex(index)}
            >
              <div className="flex-1 min-w-0">
                <span className="font-medium text-default-700 text-small block truncate">
                  {emoji.label}
                </span>
              </div>
            </ListboxItem>
          ))}
        </Listbox>
      </CardBody>
      <CardFooter className="bg-default-50/50 px-4 py-2 border-divider border-t">
        <p className="font-medium text-default-500 text-tiny">
          {t("autocompleteHint")}
        </p>
      </CardFooter>
    </Card>
  );
}
