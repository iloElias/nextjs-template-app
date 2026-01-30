"use client";

import { SharedSelection } from "@heroui/react";
import { Select } from "../form/select";

export const SUPPORTED_LANGUAGES = [
  { key: "javascript", label: "JavaScript" },
  { key: "typescript", label: "TypeScript" },
  { key: "jsx", label: "JSX" },
  { key: "tsx", label: "TSX" },
  { key: "python", label: "Python" },
  { key: "java", label: "Java" },
  { key: "csharp", label: "C#" },
  { key: "cpp", label: "C++" },
  { key: "c", label: "C" },
  { key: "go", label: "Go" },
  { key: "rust", label: "Rust" },
  { key: "php", label: "PHP" },
  { key: "ruby", label: "Ruby" },
  { key: "swift", label: "Swift" },
  { key: "kotlin", label: "Kotlin" },
  { key: "html", label: "HTML" },
  { key: "css", label: "CSS" },
  { key: "scss", label: "SCSS" },
  { key: "json", label: "JSON" },
  { key: "yaml", label: "YAML" },
  { key: "xml", label: "XML" },
  { key: "markdown", label: "Markdown" },
  { key: "sql", label: "SQL" },
  { key: "bash", label: "Bash" },
  { key: "shell", label: "Shell" },
  { key: "powershell", label: "PowerShell" },
  { key: "dockerfile", label: "Dockerfile" },
  { key: "plaintext", label: "Plain Text" },
];

interface LanguageSelectorProps {
  value: string;
  onChange: (language: string) => void;
  size?: "sm" | "md" | "lg";
  label?: string;
  className?: string;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  value,
  onChange,
  label = "Language",
  className = "max-w-48",
}) => {
  const handleSelectionChange = (keys: SharedSelection) => {
    const selectedValue = Array.from(keys)[0] as string;
    if (selectedValue) {
      onChange(selectedValue);
    }
  };

  return (
    <Select
      size="sm"
      variant="flat"
      label={label}
      selectedKeys={new Set([value])}
      onSelectionChange={handleSelectionChange}
      className={className}
      aria-label="Select code language"
      items={SUPPORTED_LANGUAGES}
    />
  );
};
