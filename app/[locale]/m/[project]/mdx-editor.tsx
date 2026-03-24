"use client";

import { Button } from "@/components/button";
import { Input } from "@/components/form/input";
import { useCurrentLocale, useScopedI18n } from "@/locales/client";
import { Chip } from "@heroui/react";
import { AltArrowLeft } from "@solar-icons/react";
import { useLocalStorage } from "ilias-use-storage";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useState } from "react";

interface MarkdownProject {
  id: string;
  title: string;
  content: string;
  color: string;
  createdAt: number;
  updatedAt: number;
}

const MDXEditorComponent = dynamic(
  () =>
    import("@/components/markdown/mdx-editor").then((mod) => ({
      default: mod.MDXEditorComponent,
    })),
  { ssr: false },
);

interface MdxEditorProps {
  projectId: string;
}

export default function MdxEditor({ projectId }: MdxEditorProps) {
  const t = useScopedI18n("markdown-projects");
  const locale = useCurrentLocale();
  const [projects, setProjects] = useLocalStorage<MarkdownProject[]>(
    "mdx-projects",
    [],
  );
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">(
    "idle",
  );

  useEffect(() => {
    if (saveStatus === "saved") {
      const timer = setTimeout(() => setSaveStatus("idle"), 2000);
      return () => clearTimeout(timer);
    }
  }, [saveStatus]);

  const project = projects.find((p) => p.id === projectId);

  function updateProject(updates: Partial<MarkdownProject>) {
    setProjects((prev) =>
      prev.map((p) =>
        p.id === projectId ? { ...p, ...updates, updatedAt: Date.now() } : p,
      ),
    );
  }

  if (!project) {
    return (
      <div className="flex flex-col items-center gap-4 py-20 text-center">
        <p>{t("projectNotFound")}</p>
        <Button
          as={Link}
          href={`/${locale}/m`}
          startContent={<AltArrowLeft />}
          variant="flat"
        >
          {t("backToProjects")}
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <Link href="/m">
        <Button
          isIconOnly
          aria-label={t("backToProjects")}
        >
          <AltArrowLeft />
        </Button>
        </Link>
        <Input
          value={project.title}
          onChange={(e) => updateProject({ title: e.target.value })}
          placeholder={t("titlePlaceholder")}
          className="flex-1"
        />
        {saveStatus !== "idle" && (
          <Chip
            size="sm"
            color={saveStatus === "saving" ? "warning" : "success"}
            variant="flat"
          >
            {saveStatus === "saving" ? t("saving") : t("saved")}
          </Chip>
        )}
      </div>
      <MDXEditorComponent
        key={projectId}
        markdown={project.content}
        onChange={(markdown) => {
          setSaveStatus("saving");
          setProjects((prev) =>
            prev.map((p) =>
              p.id === projectId
                ? { ...p, content: markdown, updatedAt: Date.now() }
                : p,
            ),
          );
          setSaveStatus("saved");
        }}
      />
    </div>
  );
}
