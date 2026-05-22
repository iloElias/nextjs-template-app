import { api } from "@/service/api";
import { getApiUrl } from "@/service/env";

export interface MarkdownExportResult {
  uuid: string;
  filename: string;
  version: number;
  size: number;
  status: "pending" | "completed" | "failed";
  download_url: string;
  project_id: string | null;
  created_at: string;
}

export interface MarkdownExportVersion {
  uuid: string;
  filename: string;
  version: number;
  size: number;
  created_at: string;
}

/**
 * Converte markdown para PDF via backend.
 * Aceita o conteúdo como string e metadados opcionais.
 */
export async function convertMarkdownToPdf(params: {
  content: string;
  projectId?: string;
  filename?: string;
}): Promise<MarkdownExportResult> {
  const { data } = await api.post<MarkdownExportResult>(
    "/pdf/markdown/convert",
    {
      content: params.content,
      project_id: params.projectId ?? null,
      filename: params.filename ?? null,
    },
  );

  return data;
}

/**
 * Converte markdown para PDF enviando um arquivo .md via multipart.
 */
export async function convertMarkdownFileToPdf(params: {
  file: File;
  projectId?: string;
  filename?: string;
}): Promise<MarkdownExportResult> {
  const form = new FormData();
  form.append("file", params.file);
  if (params.projectId) form.append("project_id", params.projectId);
  if (params.filename) form.append("filename", params.filename);

  const { data } = await api.post<MarkdownExportResult>(
    "/pdf/markdown/convert",
    form,
    { headers: { "Content-Type": "multipart/form-data" } },
  );

  return data;
}

/**
 * Lista todas as versões exportadas de um projeto.
 * Requer autenticação.
 */
export async function listMarkdownExportVersions(
  projectId: string,
): Promise<MarkdownExportVersion[]> {
  const { data } = await api.get<MarkdownExportVersion[]>(
    `/pdf/markdown/project/${projectId}/versions`,
  );

  return data;
}

/**
 * Obtém uma nova URL temporária de download para um PDF já gerado.
 */
export async function getMarkdownExportTemporaryUrl(
  uuid: string,
): Promise<string> {
  const { data } = await api.get<{ download_url: string; expires_in: number }>(
    `/pdf/markdown/${uuid}/url`,
  );

  return data.download_url;
}

/**
 * Remove uma versão de exportação (requer autenticação).
 */
export async function deleteMarkdownExport(uuid: string): Promise<void> {
  await api.delete(`/pdf/markdown/${uuid}`);
}

/**
 * Monta a URL de download direto de um PDF via Laravel API.
 */
export function getMarkdownExportDownloadUrl(uuid: string): string {
  return `${getApiUrl()}/api/pdf/markdown/${uuid}`;
}

/**
 * Formata o tamanho do arquivo para exibição (ex: "512 KB", "1.2 MB").
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}
