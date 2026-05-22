"use client";

import "@/app/styles/utilities/mdx-print.css";

import { Button } from "@/components/button";
import { Loading } from "@/components/loading";
import {
  convertMarkdownToPdf,
  deleteMarkdownExport,
  formatFileSize,
  getMarkdownExportDownloadUrl,
  listMarkdownExportVersions,
  type MarkdownExportResult,
  type MarkdownExportVersion,
} from "@/http/pdf";
import { useCurrentLocale, useScopedI18n } from "@/locales/client";
import {
  Chip,
  Divider,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Tooltip,
  useDisclosure,
} from "@heroui/react";
import {
  AltArrowLeft,
  ClipboardText,
  DocumentAdd,
  DownloadMinimalistic,
  SolarProvider,
  TrashBin2,
} from "@solar-icons/react";
import { useLocalStorage } from "ilias-use-storage";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useMemo, useState } from "react";

const MDXEditorComponent = dynamic(
  () =>
    import("@/components/markdown/mdx-editor").then((mod) => ({
      default: mod.MDXEditorComponent,
    })),
  { ssr: false },
);

interface LocalProject {
  id: string;
  title: string;
  content: string;
  color: string;
  createdAt: number;
  updatedAt: number;
}

type ExportStatus = "idle" | "exporting" | "success" | "error";

function MarkdownPdfContent() {
  const t = useScopedI18n("markdown-pdf");
  const locale = useCurrentLocale();
  const searchParams = useSearchParams();

  const projectId = searchParams.get("project");
  const rawContent = searchParams.get("content");

  const [projects] = useLocalStorage<LocalProject[]>("mdx-projects", []);

  const [exportStatus, setExportStatus] = useState<ExportStatus>("idle");
  const [lastExport, setLastExport] = useState<MarkdownExportResult | null>(
    null,
  );
  const [versions, setVersions] = useState<MarkdownExportVersion[]>([]);
  const [loadingVersions, setLoadingVersions] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const { content, title, source } = useMemo<{
    content: string | null;
    title: string;
    source: "project" | "url" | null;
  }>(() => {
    if (projectId) {
      const project = projects.find((p) => p.id === projectId);
      if (project) {
        return {
          content: project.content,
          title: project.title || t("noContent"),
          source: "project",
        };
      }
    }

    if (rawContent) {
      try {
        const decoded = decodeURIComponent(atob(rawContent));
        return { content: decoded, title: "document", source: "url" };
      } catch {
        return { content: null, title: "", source: null };
      }
    }

    return { content: null, title: "", source: null };
  }, [projectId, rawContent, projects, t]);

  const loadVersions = useCallback(async () => {
    if (!projectId) return;
    setLoadingVersions(true);
    try {
      const data = await listMarkdownExportVersions(projectId);
      setVersions(data);
    } catch {
    } finally {
      setLoadingVersions(false);
    }
  }, [projectId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadVersions();
  }, [loadVersions]);

  async function handleExport() {
    if (!content) return;

    setExportStatus("exporting");
    try {
      const project = projectId
        ? projects.find((p) => p.id === projectId)
        : null;

      const result = await convertMarkdownToPdf({
        content,
        projectId: projectId ?? undefined,
        filename: project?.title ?? title,
      });

      setLastExport(result);
      setExportStatus("success");
      await loadVersions();
    } catch {
      setExportStatus("error");
    }

    setTimeout(() => setExportStatus("idle"), 4000);
  }

  function handleCopyLink() {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    });
  }

  function handleDeleteClick(uuid: string) {
    setDeleteTarget(uuid);
    onOpen();
  }

  async function handleConfirmDelete() {
    if (!deleteTarget) return;
    try {
      await deleteMarkdownExport(deleteTarget);
      await loadVersions();
      if (lastExport?.uuid === deleteTarget) setLastExport(null);
    } catch {
    } finally {
      setDeleteTarget(null);
      onClose();
    }
  }

  if (!content) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-8 text-center">
        <p className="text-xl font-semibold">{t("noContent")}</p>
        <p className="text-default-500">{t("noContentDescription")}</p>
        <Button as={Link} href={`/${locale}/m`} startContent={<AltArrowLeft />}>
          {t("backToProjects")}
        </Button>
      </div>
    );
  }

  const isExporting = exportStatus === "exporting";

  return (
    <SolarProvider value={{ weight: "Linear", size: 18 }}>
      {/* ── Barra de ações (não aparece na impressão) ── */}
      <div className="no-print sticky top-0 z-40 border-b border-divider bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3">
          {/* Voltar */}
          {projectId ? (
            <Button
              as={Link}
              href={`/${locale}/m/${projectId}`}
              variant="flat"
              size="sm"
              startContent={<AltArrowLeft />}
            >
              {t("backToProject")}
            </Button>
          ) : (
            <Button
              as={Link}
              href={`/${locale}/m`}
              variant="flat"
              size="sm"
              startContent={<AltArrowLeft />}
            >
              {t("backToProjects")}
            </Button>
          )}

          <Divider orientation="vertical" className="h-6" />

          {/* Origem */}
          <Chip size="sm" variant="flat" color="default">
            {t("contentSource")}:{" "}
            {source === "project"
              ? t("contentSourceProject")
              : t("contentSourceUrl")}
          </Chip>

          <div className="flex-1" />

          {/* Copiar link */}
          <Tooltip content={linkCopied ? t("linkCopied") : t("copyLink")}>
            <Button
              isIconOnly
              variant="flat"
              size="sm"
              onPress={handleCopyLink}
              aria-label={t("copyLink")}
            >
              <ClipboardText />
            </Button>
          </Tooltip>

          {/* Exportar para servidor */}
          <Button
            color={
              exportStatus === "success"
                ? "success"
                : exportStatus === "error"
                  ? "danger"
                  : "primary"
            }
            size="sm"
            startContent={
              isExporting ? <Loading size="sm" /> : <DocumentAdd size={16} />
            }
            isDisabled={isExporting}
            onPress={handleExport}
          >
            {isExporting
              ? t("exporting")
              : exportStatus === "success"
                ? t("exportSuccess")
                : exportStatus === "error"
                  ? t("exportError")
                  : t("exportToServer")}
          </Button>

          {/* Download do último PDF gerado */}
          {lastExport && (
            <Button
              as="a"
              href={lastExport.download_url}
              target="_blank"
              rel="noreferrer"
              color="success"
              variant="flat"
              size="sm"
              startContent={<DownloadMinimalistic size={16} />}
            >
              {t("downloadPdf")} v{lastExport.version}
            </Button>
          )}
        </div>

        {/* Histórico de versões */}
        {projectId && (loadingVersions || versions.length > 0) && (
          <div className="border-t border-divider bg-default-50 px-4 py-2">
            <p className="mb-2 text-tiny font-semibold tracking-wide text-default-500 uppercase">
              {t("versionsTitle")}
            </p>

            {loadingVersions ? (
              <Loading size="sm" label="" />
            ) : (
              <div className="flex flex-wrap gap-2">
                {versions.map((v) => (
                  <div
                    key={v.uuid}
                    className="flex items-center gap-1.5 rounded-lg border border-divider bg-background px-2.5 py-1 text-tiny"
                  >
                    <span className="font-semibold text-primary">
                      {t("version", { n: v.version })}
                    </span>
                    <span className="text-default-400">
                      {formatFileSize(v.size)}
                    </span>
                    <span className="text-default-300">·</span>
                    <span className="text-default-400">
                      {new Date(v.created_at).toLocaleDateString(locale)}
                    </span>

                    {/* Download desta versão */}
                    <Tooltip content={t("downloadPdf")}>
                      <Button
                        as="a"
                        href={getMarkdownExportDownloadUrl(v.uuid)}
                        target="_blank"
                        rel="noreferrer"
                        isIconOnly
                        variant="light"
                        size="sm"
                        className="h-5 min-w-5"
                        aria-label={t("downloadPdf")}
                      >
                        <DownloadMinimalistic size={12} />
                      </Button>
                    </Tooltip>

                    {/* Excluir esta versão */}
                    <Tooltip content={t("deleteVersion")} color="danger">
                      <Button
                        isIconOnly
                        variant="light"
                        size="sm"
                        color="danger"
                        className="h-5 min-w-5"
                        onPress={() => handleDeleteClick(v.uuid)}
                        aria-label={t("deleteVersion")}
                      >
                        <TrashBin2 size={12} />
                      </Button>
                    </Tooltip>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Conteúdo Markdown (pré-visualização + print) ── */}
      <div className="print-container mx-auto max-w-[21cm] overflow-hidden px-8 py-8 print:p-0">
        <MDXEditorComponent markdown={content} readOnly />
      </div>

      {/* ── Modal de confirmação de exclusão ── */}
      <Modal isOpen={isOpen} onClose={onClose} size="sm">
        <ModalContent>
          <ModalHeader>{t("deleteVersion")}</ModalHeader>
          <ModalBody>
            <p className="text-sm text-default-600">
              {t("confirmDeleteVersion")}
            </p>
          </ModalBody>
          <ModalFooter>
            <Button variant="flat" onPress={onClose}>
              {/* shared cancel label from markdown-projects */}
              Cancel
            </Button>
            <Button color="danger" onPress={handleConfirmDelete}>
              {t("deleteVersion")}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </SolarProvider>
  );
}

export default function MarkdownPdfPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <Loading size="lg" />
        </div>
      }
    >
      <MarkdownPdfContent />
    </Suspense>
  );
}
