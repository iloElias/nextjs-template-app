"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

interface LinkPreviewData {
  url: string;
  title: string;
  text: string;
  linkNodeKey: string;
  position: { top: number; left: number };
}

interface LinkEditData {
  url: string;
  title: string;
  text: string;
  isEditing: boolean;
}

interface ImageEditData {
  src: string;
  altText: string;
  title?: string;
  imageNodeKey?: string;
  isEditing: boolean;
}

interface MathEditData {
  formula: string;
  mathType: "inline" | "block";
  isEditing: boolean;
  mathNodeKey?: string;
}

interface MdxEditorContextValue {
  linkPreview: LinkPreviewData | null;
  setLinkPreview: (data: LinkPreviewData | null) => void;

  linkEdit: LinkEditData | null;
  setLinkEdit: (data: LinkEditData | null) => void;

  isLinkDialogOpen: boolean;
  openLinkDialog: () => void;
  closeLinkDialog: () => void;

  removeLink: (linkNodeKey: string) => void;
  setRemoveLink: (fn: (linkNodeKey: string) => void) => void;

  imageEdit: ImageEditData | null;
  setImageEdit: (data: ImageEditData | null) => void;

  isImageDialogOpen: boolean;
  openImageDialog: () => void;
  closeImageDialog: () => void;

  isTableDialogOpen: boolean;
  openTableDialog: () => void;
  closeTableDialog: () => void;

  isCodeBlockDialogOpen: boolean;
  openCodeBlockDialog: () => void;
  closeCodeBlockDialog: () => void;

  mathEdit: MathEditData | null;
  setMathEdit: (data: MathEditData | null) => void;

  isMathDialogOpen: boolean;
  openMathDialog: () => void;
  closeMathDialog: () => void;

  currentCodeLanguage?: string;
  setCurrentCodeLanguage: (language?: string) => void;

  readOnly: boolean;
  setReadOnly: (readOnly: boolean) => void;
}

const MdxEditorContext = createContext<MdxEditorContextValue | undefined>(
  undefined,
);

export const useMdxEditor = () => {
  const context = useContext(MdxEditorContext);
  if (!context) {
    throw new Error("useMdxEditor must be used within MdxEditorProvider");
  }
  return context;
};

interface MdxEditorProviderProps {
  children: React.ReactNode;
  readOnly?: boolean;
}

export const MdxEditorProvider: React.FC<MdxEditorProviderProps> = ({
  children,
  readOnly: editorReadOnly,
}) => {
  const [linkPreview, setLinkPreview] = useState<LinkPreviewData | null>(null);
  const [linkEdit, setLinkEdit] = useState<LinkEditData | null>(null);
  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false);
  const [removeLink, setRemoveLink] = useState<(linkNodeKey: string) => void>(
    () => () => {},
  );
  const [imageEdit, setImageEdit] = useState<ImageEditData | null>(null);
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
  const [isTableDialogOpen, setIsTableDialogOpen] = useState(false);
  const [isCodeBlockDialogOpen, setIsCodeBlockDialogOpen] = useState(false);
  const [mathEdit, setMathEdit] = useState<MathEditData | null>(null);
  const [isMathDialogOpen, setIsMathDialogOpen] = useState(false);
  const [currentCodeLanguage, setCurrentCodeLanguage] = useState<
    string | undefined
  >("javascript");
  const [readOnly, setReadOnly] = useState<boolean>(!!editorReadOnly);

  const openLinkDialog = useCallback(() => {
    setIsLinkDialogOpen(true);
  }, []);

  const closeLinkDialog = useCallback(() => {
    setIsLinkDialogOpen(false);
    setLinkEdit(null);
  }, []);

  const openImageDialog = useCallback(() => {
    setIsImageDialogOpen(true);
  }, []);

  const closeImageDialog = useCallback(() => {
    setIsImageDialogOpen(false);
    setImageEdit(null);
  }, []);

  const openTableDialog = useCallback(() => {
    setIsTableDialogOpen(true);
  }, []);

  const closeTableDialog = useCallback(() => {
    setIsTableDialogOpen(false);
  }, []);

  const openCodeBlockDialog = useCallback(() => {
    setIsCodeBlockDialogOpen(true);
  }, []);

  const closeCodeBlockDialog = useCallback(() => {
    setIsCodeBlockDialogOpen(false);
  }, []);

  const openMathDialog = useCallback(() => {
    setIsMathDialogOpen(true);
  }, []);

  const closeMathDialog = useCallback(() => {
    setIsMathDialogOpen(false);
    setMathEdit(null);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setReadOnly(!!editorReadOnly);
  }, [editorReadOnly]);

  return (
    <MdxEditorContext.Provider
      value={{
        linkPreview,
        setLinkPreview,
        linkEdit,
        setLinkEdit,
        isLinkDialogOpen,
        openLinkDialog,
        closeLinkDialog,
        removeLink,
        setRemoveLink,
        imageEdit,
        setImageEdit,
        isImageDialogOpen,
        openImageDialog,
        closeImageDialog,
        isTableDialogOpen,
        openTableDialog,
        closeTableDialog,
        isCodeBlockDialogOpen,
        openCodeBlockDialog,
        closeCodeBlockDialog,
        mathEdit,
        setMathEdit,
        isMathDialogOpen,
        openMathDialog,
        closeMathDialog,
        currentCodeLanguage,
        setCurrentCodeLanguage,
        readOnly,
        setReadOnly,
      }}
    >
      {children}
    </MdxEditorContext.Provider>
  );
};
