export type PageSize = "A4" | "Letter" | "Legal" | "A3" | "A5";
export type PageOrientation = "portrait" | "landscape";
export type ColorMode = "color" | "grayscale";

export interface PrintSettings {
  pageSize: PageSize;
  orientation: PageOrientation;
  marginTop: string;
  marginRight: string;
  marginBottom: string;
  marginLeft: string;
  showPageNumbers: boolean;
  showDate: boolean;
  showTitle: boolean;
  colorMode: ColorMode;
  printBackgrounds: boolean;
}

export const DEFAULT_PRINT_SETTINGS: PrintSettings = {
  pageSize: "A4",
  orientation: "portrait",
  marginTop: "20mm",
  marginRight: "20mm",
  marginBottom: "20mm",
  marginLeft: "20mm",
  showPageNumbers: false,
  showDate: false,
  showTitle: true,
  colorMode: "color",
  printBackgrounds: true,
};
