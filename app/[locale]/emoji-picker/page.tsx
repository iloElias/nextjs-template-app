"use client";

import { EmojiPickerButton } from "@/components/emoji/emoji-picker-button";
import { DefaultLayout } from "@/components/layout/layout";
import { useState } from "react";

export default function EmojiPickerPage() {
  const [selectedEmoji, setSelectedEmoji] = useState<string>("");
  const [emojiList, setEmojiList] = useState<string[]>([]);

  const handleEmojiSelect = (emoji: string) => {
    setSelectedEmoji(emoji);
    setEmojiList((prev) => [...prev, emoji]);
  };

  const clearEmojis = () => {
    setSelectedEmoji("");
    setEmojiList([]);
  };

  return (
    <DefaultLayout>
      <div className="min-h-screen bg-background p-8">
        <div className="mx-auto max-w-4xl">
          <h1 className="mb-2 text-4xl font-bold text-default-900">
            Emoji Picker Demo
          </h1>
          <p className="mb-8 text-default-600">
            Custom wrapped emoji picker using Frimousse library
          </p>

          <div className="space-y-8">
            {/* Example 1: Default Button */}
            <section className="rounded-lg border border-default-200 bg-content1 p-6">
              <h2 className="mb-4 text-2xl font-semibold text-default-800">
                Default Emoji Picker Button
              </h2>
              <div className="flex flex-wrap items-start gap-4">
                <EmojiPickerButton onEmojiSelect={handleEmojiSelect} />
                <EmojiPickerButton
                  buttonLabel="🎨 Choose Emoji"
                  variant="bordered"
                  color="primary"
                  onEmojiSelect={handleEmojiSelect}
                />
                <EmojiPickerButton
                  buttonLabel="✨ Pick Emoji"
                  variant="solid"
                  color="secondary"
                  size="lg"
                  onEmojiSelect={handleEmojiSelect}
                />
              </div>
            </section>
            <section className="rounded-lg border border-default-200 bg-content1 p-6">
              <h2 className="mb-4 text-2xl font-semibold text-default-800">
                Custom Container Padding
              </h2>
              <div className="flex flex-wrap gap-4">
                <EmojiPickerButton
                  buttonLabel="No Padding"
                  containerPadding="none"
                  variant="flat"
                  onEmojiSelect={handleEmojiSelect}
                />
                <EmojiPickerButton
                  buttonLabel="Small Padding"
                  containerPadding="small"
                  variant="flat"
                  onEmojiSelect={handleEmojiSelect}
                />
                <EmojiPickerButton
                  buttonLabel="Large Padding"
                  containerPadding="large"
                  variant="flat"
                  onEmojiSelect={handleEmojiSelect}
                />
              </div>
            </section>

            {/* Example 3: Without Search */}
            <section className="rounded-lg border border-default-200 bg-content1 p-6">
              <h2 className="mb-4 text-2xl font-semibold text-default-800">
                Without Search Input
              </h2>
              <EmojiPickerButton
                buttonLabel="No Search"
                showSearch={false}
                variant="bordered"
                onEmojiSelect={handleEmojiSelect}
              />
            </section>

            {/* Selected Emoji Display */}
            {selectedEmoji && (
              <section className="rounded-lg border border-default-200 bg-content1 p-6">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-2xl font-semibold text-default-800">
                    Selected Emoji
                  </h2>
                  <button
                    onClick={clearEmojis}
                    className="text-sm text-danger hover:underline"
                  >
                    Clear All
                  </button>
                </div>
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <span className="text-6xl">{selectedEmoji}</span>
                    <span className="text-default-600">Last selected</span>
                  </div>

                  {emojiList.length > 0 && (
                    <div>
                      <h3 className="mb-2 text-sm font-medium text-default-600">
                        All selected emojis ({emojiList.length}):
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {emojiList.map((emoji, index) => (
                          <span
                            key={index}
                            className="text-3xl transition-transform hover:scale-110"
                          >
                            {emoji}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* Features Section */}
            <section className="rounded-lg border border-default-200 bg-content1 p-6">
              <h2 className="mb-4 text-2xl font-semibold text-default-800">
                Features
              </h2>
              <ul className="list-inside list-disc space-y-2 text-default-600">
                <li>Custom wrapped search input component</li>
                <li>Custom container with configurable padding</li>
                <li>Custom styled emoji buttons with hover effects</li>
                <li>Active emoji preview at the bottom</li>
                <li>Skin tone selector</li>
                <li>Customizable button variants and colors</li>
                <li>Keyboard navigation support</li>
                <li>Responsive design</li>
              </ul>
            </section>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
}
