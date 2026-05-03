"use client";

import { Dialogue } from "@/components/dialogue";
import { Input } from "@/components/form/input";
import { ModalBody, ModalFooter, ModalHeader } from "@/components/modal";
import { ColorPickerDropdown } from "@/components/ui/color-picker";
import { useCurrentLocale, useScopedI18n } from "@/locales/client";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  useDisclosure,
} from "@heroui/react";
import {
  Document,
  DocumentAdd,
  Pen,
  TrashBin2,
  Upload,
} from "@solar-icons/react";
import { useLocalStorage } from "ilias-use-storage";
import Link from "next/link";
import { darken, getLuminance, lighten, readableColor } from "polished";
import { useRef, useState } from "react";

interface MarkdownProject {
  id: string;
  title: string;
  content: string;
  color: string;
  createdAt: number;
  updatedAt: number;
}

const DEFAULT_PROJECT_COLOR = "#FAFAFA"; // Tailwind gray-50

export default function Projects() {
  const t = useScopedI18n("markdown-projects");
  const locale = useCurrentLocale();
  const [projects, setProjects] = useLocalStorage<MarkdownProject[]>(
    "mdx-projects",
    [],
  );

  const createDisclosure = useDisclosure();
  const editDisclosure = useDisclosure();
  const [newTitle, setNewTitle] = useState("");
  const [newColor, setNewColor] = useState(DEFAULT_PROJECT_COLOR);
  const [editingProject, setEditingProject] = useState<MarkdownProject | null>(
    null,
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  function openCreateModal() {
    setNewTitle("");
    setNewColor(DEFAULT_PROJECT_COLOR);
    createDisclosure.onOpen();
  }

  function openEditModal(project: MarkdownProject) {
    setEditingProject(project);
    setNewTitle(project.title);
    setNewColor(project.color);
    editDisclosure.onOpen();
  }

  function handleCreate() {
    const id = crypto.randomUUID();
    const now = Date.now();
    const newProject: MarkdownProject = {
      id,
      title: newTitle,
      content: "",
      color: newColor,
      createdAt: now,
      updatedAt: now,
    };
    setProjects((prev) => [...prev, newProject]);
    createDisclosure.onClose();
    window.location.href = `/${locale}/m/${id}`;
  }

  function handleEdit() {
    if (!editingProject) return;
    setProjects((prev) =>
      prev.map((p) =>
        p.id === editingProject.id
          ? { ...p, title: newTitle, color: newColor, updatedAt: Date.now() }
          : p,
      ),
    );
    editDisclosure.onClose();
    setEditingProject(null);
  }

  function deleteProject(id: string) {
    setProjects((prev) => prev.filter((p) => p.id !== id));
  }

  function handleUploadClick() {
    fileInputRef.current?.click();
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.match(/\.(md|markdown)$/i)) {
      alert(t("uploadMarkdownError"));
      e.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const content = reader.result as string;
      const title = file.name
        .replace(/\.(md|markdown)$/i, "")
        .trim()
        .toLowerCase()
        .replace(/[\s\-]+/g, "_")
        .replace(/[^a-z0-9_]/g, "");
      const id = crypto.randomUUID();
      const now = Date.now();
      const newProject: MarkdownProject = {
        id,
        title,
        content,
        color: DEFAULT_PROJECT_COLOR,
        createdAt: now,
        updatedAt: now,
      };
      setProjects((prev) => [...prev, newProject]);
      window.location.href = `/${locale}/m/${id}`;
    };
    reader.readAsText(file);
    e.target.value = "";
  }

  return (
    <div className="flex flex-col gap-6">
      <input
        ref={fileInputRef}
        type="file"
        accept=".md,.markdown"
        className="hidden"
        onChange={handleFileChange}
      />
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold">{t("title")}</h1>
        <div className="flex gap-2">
          <Button
            variant="flat"
            startContent={<Upload />}
            onPress={handleUploadClick}
            className="flex-1 sm:flex-none"
          >
            {t("uploadMarkdown")}
          </Button>
          <Button
            color="primary"
            startContent={<DocumentAdd />}
            onPress={openCreateModal}
            className="flex-1 sm:flex-none"
          >
            {t("newProject")}
          </Button>
        </div>
      </div>

      {projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
          <Document size={48} />
          <div>
            <p className="text-lg font-medium">{t("noProjects")}</p>
            <p className="text-sm">{t("noProjectsDescription")}</p>
          </div>
          <Button
            color="primary"
            startContent={<DocumentAdd />}
            onPress={openCreateModal}
          >
            {t("newProject")}
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => {
            const luminance = getLuminance(project.color);
            const isLight = luminance > 0.5;

            const textColor = readableColor(
              project.color,
              "#3f3f46",
              "#e4e4e7",
            );
            const borderColor = isLight
              ? darken(0.15, project.color)
              : lighten(0.15, project.color);

            const buttonColor = isLight
              ? darken(0.1, project.color)
              : lighten(0.1, project.color);

            return (
              <Card
                key={project.id}
                style={{
                  backgroundColor: project.color,
                  borderColor: borderColor,
                  borderWidth: "2px",
                  borderStyle: "solid",
                }}
              >
                <CardHeader className="gap-2 pb-0">
                  <h2
                    className="line-clamp-1 text-lg font-semibold"
                    style={{ color: textColor }}
                  >
                    {project.title || t("untitled")}
                  </h2>
                </CardHeader>
                <CardBody className="py-2 pt-0">
                  <p
                    className="text-sm"
                    style={{ color: textColor, opacity: 0.7 }}
                  >
                    {t("lastEdited", {
                      date: new Date(project.updatedAt).toLocaleDateString(
                        locale,
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        },
                      ),
                    })}
                  </p>
                </CardBody>
                <Divider style={{ backgroundColor: borderColor }} />
                <CardFooter className="gap-2">
                  <Link href={`/m/${project.id}`} className="flex-1">
                    <Button
                      size="sm"
                      className="w-full"
                      style={{
                        backgroundColor: borderColor,
                        color: textColor,
                      }}
                    >
                      {t("openProject")}
                    </Button>
                  </Link>
                  <Button
                    size="sm"
                    isIconOnly
                    onPress={() => openEditModal(project)}
                    aria-label={t("editProject")}
                    style={{
                      backgroundColor: buttonColor,
                      color: textColor,
                    }}
                  >
                    <Pen size={16} />
                  </Button>
                  <Button
                    size="sm"
                    isIconOnly
                    onPress={() => deleteProject(project.id)}
                    aria-label={t("deleteProject")}
                    style={{
                      backgroundColor: buttonColor,
                      color: textColor,
                    }}
                  >
                    <TrashBin2 size={16} />
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}

      <Dialogue
        placement="center"
        disclosure={createDisclosure}
        size="sm"
        shouldCloseOnInteractOutside={(element) => {
          return !element.closest('[data-slot="popover"]');
        }}
      >
        <ModalHeader>{t("newProject")}</ModalHeader>
        <ModalBody className="gap-4">
          <Input
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            label={t("titlePlaceholder")}
            autoFocus
          />
          <ColorPickerDropdown
            value={newColor}
            onChange={setNewColor}
            label={t("colorLabel")}
          />
        </ModalBody>
        <ModalFooter>
          <Button variant="flat" onPress={createDisclosure.onClose}>
            {t("cancel")}
          </Button>
          <Button color="primary" onPress={handleCreate}>
            {t("create")}
          </Button>
        </ModalFooter>
      </Dialogue>

      <Dialogue
        placement="center"
        disclosure={editDisclosure}
        size="sm"
        shouldCloseOnInteractOutside={(element) => {
          return !element.closest('[data-slot="popover"]');
        }}
      >
        <ModalHeader>{t("editProject")}</ModalHeader>
        <ModalBody className="gap-4">
          <Input
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            label={t("titlePlaceholder")}
            autoFocus
          />
          <ColorPickerDropdown
            value={newColor}
            onChange={setNewColor}
            label={t("colorLabel")}
          />
        </ModalBody>
        <ModalFooter>
          <Button variant="flat" onPress={editDisclosure.onClose}>
            {t("cancel")}
          </Button>
          <Button color="primary" onPress={handleEdit}>
            {t("edit")}
          </Button>
        </ModalFooter>
      </Dialogue>
    </div>
  );
}
