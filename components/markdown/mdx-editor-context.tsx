"use client";

import React, { createContext, useContext, useState, useCallback } from "react";

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

interface MdxEditorContextValue {
  // Link preview state
  linkPreview: LinkPreviewData | null;
  setLinkPreview: (data: LinkPreviewData | null) => void;
  
  // Link edit state
  linkEdit: LinkEditData | null;
  setLinkEdit: (data: LinkEditData | null) => void;
  
  // Dialog state
  isLinkDialogOpen: boolean;
  openLinkDialog: () => void;
  closeLinkDialog: () => void;
  
  // Link operations
  removeLink: (linkNodeKey: string) => void;
  setRemoveLink: (fn: (linkNodeKey: string) => void) => void;
}

const MdxEditorContext = createContext<MdxEditorContextValue | undefined>(undefined);

export const useMdxEditor = () => {
  const context = useContext(MdxEditorContext);
  if (!context) {
    throw new Error("useMdxEditor must be used within MdxEditorProvider");
  }
  return context;
};

interface MdxEditorProviderProps {
  children: React.ReactNode;
}

export const MdxEditorProvider: React.FC<MdxEditorProviderProps> = ({ children }) => {
  const [linkPreview, setLinkPreview] = useState<LinkPreviewData | null>(null);
  const [linkEdit, setLinkEdit] = useState<LinkEditData | null>(null);
  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false);
  const [removeLink, setRemoveLink] = useState<(linkNodeKey: string) => void>(() => () => {});

  const openLinkDialog = useCallback(() => {
    setIsLinkDialogOpen(true);
  }, []);

  const closeLinkDialog = useCallback(() => {
    setIsLinkDialogOpen(false);
    setLinkEdit(null);
  }, []);

  const value: MdxEditorContextValue = {
    linkPreview,
    setLinkPreview,
    linkEdit,
    setLinkEdit,
    isLinkDialogOpen,
    openLinkDialog,
    closeLinkDialog,
    removeLink,
    setRemoveLink,
  };

  return (
    <MdxEditorContext.Provider value={value}>
      {children}
    </MdxEditorContext.Provider>
  );
};
