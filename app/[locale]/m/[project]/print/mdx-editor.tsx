"use client";

import { useScopedI18n } from "@/locales/client";
import { DEFAULT_PRINT_SETTINGS, type PrintSettings } from "@/types/print";
import { useLocalStorage } from "ilias-use-storage";
import dynamic from "next/dynamic";
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
  readonly?: boolean;
  projectId: string;
}

export default function MdxEditor({
  readonly = true,
  projectId,
}: MdxEditorProps) {
  const t = useScopedI18n("markdown-projects");
  const [projects] = useLocalStorage<MarkdownProject[]>("mdx-projects", []);
  const [printSettings] = useLocalStorage<PrintSettings>(
    "print-settings",
    DEFAULT_PRINT_SETTINGS,
  );
  const [isReady, setIsReady] = useState(false);

  const project = projects.find((p) => p.id === projectId);

  useEffect(() => {
    if (project) {
      document.title = project.title || t("untitled");
    }
  }, [project, t]);

  useEffect(() => {
    if (project && isReady) {
      const timer = setTimeout(() => {
        if (window.parent !== window) {
          window.parent.postMessage({ type: "print-ready" }, "*");
        } else {
          window.print();
        }
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [project, isReady]);

  useEffect(() => {
    if (project) {
      if (document.readyState === "complete") {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIsReady(true);
      } else {
        const handleLoad = () => setIsReady(true);
        window.addEventListener("load", handleLoad);
        return () => window.removeEventListener("load", handleLoad);
      }
    }
  }, [project]);

  if (!project) {
    return (
      <div className="flex flex-col items-center gap-4 py-20 text-center">
        <p>{t("projectNotFound")}</p>
      </div>
    );
  }

  return (
    <div className="print-content">
      <style jsx>{`
        @page {
          size: ${printSettings.pageSize} ${printSettings.orientation};
          margin-top: ${printSettings.marginTop};
          margin-right: ${printSettings.marginRight};
          margin-bottom: ${printSettings.marginBottom};
          margin-left: ${printSettings.marginLeft};
        }

        ${printSettings.showPageNumbers
          ? `
          @page {
            @bottom-right {
              content: "Page " counter(page) " of " counter(pages);
            }
          }
        `
          : ""}

        ${printSettings.showDate
          ? `
          @page {
            @top-right {
              content: "${new Date().toLocaleDateString()}";
            }
          }
        `
          : ""}

        ${printSettings.showTitle && project
          ? `
          @page {
            @top-left {
              content: "${project.title || t("untitled")}";
              font-weight: 600;
            }
          }
        `
          : ""}

        ${printSettings.colorMode === "grayscale"
          ? `
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            filter: grayscale(100%) !important;
          }
        `
          : ""}

        ${!printSettings.printBackgrounds
          ? `
          * {
            background: none !important;
            background-color: transparent !important;
          }
        `
          : ""}
      `}</style>
      <MDXEditorComponent
        key={projectId}
        markdown={project.content}
        readOnly={readonly}
      />
    </div>
  );
}
