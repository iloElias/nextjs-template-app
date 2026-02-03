"use client";

import { useMemo, useState } from "react";
import { Copy, CheckCircle } from "@solar-icons/react";
import { Button, cn, Tooltip } from "@heroui/react";
import { MonacoEditorCore } from "./monaco-editor-core";

interface MonacoEditorProps {
  code: string;
  language: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
  showCopyButton?: boolean;
  showLanguageLabel?: boolean;
  height?: number | "auto";
  maxHeight?: number;
  className?: string;
  header?: React.ReactNode;
}

export const MonacoEditor: React.FC<MonacoEditorProps> = ({
  code,
  language,
  onChange,
  readOnly = false,
  showCopyButton = true,
  showLanguageLabel = true,
  height = "auto",
  className,
  header,
}) => {
  const [copied, setCopied] = useState(false);

  const editorHeight = useMemo(() => {
    if (height !== "auto") return height;
    
    const lines = code.split("\n").length;
    const lineHeight = 16;
    const padding = 1;
    const minHeight = 100;
    const calculatedHeight = lines * lineHeight + padding;
    return Math.max(calculatedHeight, minHeight);
  }, [code, height]);

  return (
    <div
      className={cn(
        "border border-default-200 rounded-lg overflow-hidden",
        readOnly && "bg-default-50/50",
        className,
      )}
    >
      {(header || showLanguageLabel || showCopyButton) && (
        <div className="flex justify-between items-center bg-background px-2 py-2 border-default-200 border-b">
          {header ? (
            header
          ) : (
            <>
              {showLanguageLabel && (
                <span className="font-mono text-default-500 text-xs">
                  {language}
                </span>
              )}
              {showCopyButton && (
                <Tooltip
                  content={copied ? "Copied!" : "Copy code"}
                  isOpen={copied ? true : undefined}
                >
                  <div>
                    <Button
                      size="sm"
                      isIconOnly
                      className={cn(
                        "bg-default-100 hover:bg-default-200 h-8",
                        copied ? "bg-success-100!" : "",
                      )}
                      onPress={async () => {
                        await navigator.clipboard.writeText(code);
                        setCopied(true);
                        setTimeout(() => setCopied(false), 2000);
                      }}
                    >
                      {copied ? <CheckCircle /> : <Copy />}
                    </Button>
                  </div>
                </Tooltip>
              )}
            </>
          )}
        </div>
      )}
      <div onKeyDown={(e) => e.nativeEvent.stopImmediatePropagation()}>
        <MonacoEditorCore
          code={code}
          language={language}
          onChange={onChange}
          readOnly={readOnly}
          height={editorHeight}
        />
      </div>
    </div>
  );
};
