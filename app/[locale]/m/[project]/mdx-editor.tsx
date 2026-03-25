"use client";

import { Button } from "@/components/button";
import { Input } from "@/components/form/input";
import { PrintSettingsModal } from "@/components/markdown/print-settings-modal";
import {
  downloadProject,
  type DownloadFormat,
} from "@/lib/utils/download-project";
import { useCurrentLocale, useScopedI18n } from "@/locales/client";
import { Chip } from "@heroui/react";
import { AltArrowLeft, Settings } from "@solar-icons/react";
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
  const [isDownloading, setIsDownloading] = useState(false);
  const [showPrintSettings, setShowPrintSettings] = useState(false);

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

  async function handleDownload(format: DownloadFormat) {
    if (!project) return;

    // For PDF, use iframe to print without redirecting
    if (format === "pdf") {
      setIsDownloading(true);
      const printUrl = `/${locale}/m/${projectId}/print`;

      // Create hidden iframe
      const iframe = document.createElement("iframe");
      iframe.style.position = "fixed";
      iframe.style.right = "0";
      iframe.style.bottom = "0";
      iframe.style.width = "0";
      iframe.style.height = "0";
      iframe.style.border = "none";

      // Listen for ready message from iframe
      const handleMessage = (event: MessageEvent) => {
        if (event.data?.type === "print-ready") {
          try {
            iframe.contentWindow?.print();
          } catch (error) {
            console.error("Print failed:", error);
          } finally {
            // Clean up after print
            setTimeout(() => {
              window.removeEventListener("message", handleMessage);
              if (document.body.contains(iframe)) {
                document.body.removeChild(iframe);
              }
              setIsDownloading(false);
            }, 1000);
          }
        }
      };

      window.addEventListener("message", handleMessage);

      // Fallback: cleanup if message never arrives
      setTimeout(() => {
        window.removeEventListener("message", handleMessage);
        if (document.body.contains(iframe)) {
          document.body.removeChild(iframe);
        }
        setIsDownloading(false);
      }, 10000);

      iframe.src = printUrl;
      document.body.appendChild(iframe);
      return;
    }

    setIsDownloading(true);
    try {
      await downloadProject(
        format,
        project.title || t("untitled"),
        project.content,
      );
    } catch (error) {
      console.error("Download failed:", error);
    } finally {
      setIsDownloading(false);
    }
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
          <Button isIconOnly aria-label={t("backToProjects")}>
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
        <Button
          isIconOnly
          variant="flat"
          aria-label={t("printSettings")}
          onPress={() => setShowPrintSettings(true)}
        >
          <Settings />
        </Button>
      </div>
      <PrintSettingsModal
        isOpen={showPrintSettings}
        onClose={() => setShowPrintSettings(false)}
      />
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
        onDownload={handleDownload}
        isDownloading={isDownloading}
      />
    </div>
  );
}
