export type ErrorType =
  | "page-not-found"
  | "resource-not-found"
  | "error"
  | "unauthorized"
  | "forbidden";

export interface ErrorConfig {
  title: string;
  description: string;
  statusCode?: number;
  icon?: React.ReactNode;
  showHomeButton?: boolean;
  showBackButton?: boolean;
  customAction?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
}

export const defaultErrorConfigs: Record<
  ErrorType,
  Omit<ErrorConfig, "icon">
> = {
  "page-not-found": {
    title: "Page Not Found",
    description: "The page you are looking for does not exist.",
    statusCode: 404,
    showHomeButton: true,
    showBackButton: true,
  },
  "resource-not-found": {
    title: "Resource Not Found",
    description:
      "The resource or register you are looking for could not be found.",
    statusCode: 404,
    showHomeButton: false,
    showBackButton: true,
  },
  error: {
    title: "Something Went Wrong",
    description: "An unexpected error occurred. Please try again later.",
    statusCode: 500,
    showHomeButton: true,
    showBackButton: false,
  },
  unauthorized: {
    title: "Unauthorized",
    description: "You need to be logged in to access this page.",
    statusCode: 401,
    showHomeButton: true,
    showBackButton: false,
  },
  forbidden: {
    title: "Access Forbidden",
    description: "You don't have permission to access this resource.",
    statusCode: 403,
    showHomeButton: true,
    showBackButton: true,
  },
};
