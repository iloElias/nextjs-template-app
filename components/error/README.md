# Error Components

Reusable error display components for different error scenarios in your Next.js application with full internationalization support.

## Components

### ErrorDisplay

The main generic error component that can display different types of errors with automatic internationalization.

```tsx
import { ErrorDisplay } from "@/components/error";

// Page not found (button labels automatically translated)
<ErrorDisplay type="page-not-found" />

// Resource not found
<ErrorDisplay type="resource-not-found" />

// Generic error
<ErrorDisplay type="error" />

// Unauthorized
<ErrorDisplay type="unauthorized" />

// Forbidden
<ErrorDisplay type="forbidden" />

// Custom error with manual translations
<ErrorDisplay
  type="error"
  title={t("custom.error.title")}
  description={t("custom.error.description")}
/>
```

#### Props

- `type`: `"page-not-found" | "resource-not-found" | "error" | "unauthorized" | "forbidden"`
- `title?`: Custom title (overrides default)
- `description?`: Custom description (overrides default)
- `statusCode?`: HTTP status code to display
- `icon?`: Custom icon element
- `showHomeButton?`: Show "Go to Home" button
- `showBackButton?`: Show "Go Back" button
- `homeButtonLabel?`: Custom label for home button (enables manual translation)
- `backButtonLabel?`: Custom label for back button (enables manual translation)
- `customAction?`: Custom action button configuration
- `className?`: Additional CSS classes

### ResourceNotFound

A specialized component for displaying errors when a specific resource/register is not found (e.g., a product, user, order).

```tsx
import { ResourceNotFound } from "@/components/error/resource-not-found";

// Basic usage
<ResourceNotFound />

// With resource details
<ResourceNotFound
  resourceName="Product"
  resourceId="123"
/>

// With custom description
<ResourceNotFound
  resourceName="Order"
  resourceId="ABC-123"
  customDescription="This order has been deleted or does not exist."
/>

// With custom back action
<ResourceNotFound
  resourceName="User"
  resourceId={userId}
  onGoBack={() => router.push('/users')}
/>
```

#### ResourceNotFound Props

- `resourceName?`: Name of the resource (default: "Resource")
- `resourceId?`: ID of the missing resource
- `customDescription?`: Custom error message
- `onGoBack?`: Custom back action handler

## Usage Examples

### In API Route Handlers

```tsx
// app/api/products/[id]/route.ts
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const product = await db.product.findUnique({
    where: { id: params.id },
  });

  if (!product) {
    return NextResponse.json(
      { error: "Product not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(product);
}
```

### In Page Components

```tsx
// app/products/[id]/page.tsx
import { ResourceNotFound } from "@/components/error/resource-not-found";

export default async function ProductPage({
  params
}: {
  params: { id: string }
}) {
  const product = await getProduct(params.id);

  if (!product) {
    return (
      <ResourceNotFound
        resourceName="Product"
        resourceId={params.id}
      />
    );
  }

  return <ProductDetails product={product} />;
}
```

### Custom Error Display

```tsx
import { ErrorDisplay } from "@/components/error";

<ErrorDisplay
  type="error"
  title="Payment Failed"
  description="We couldn't process your payment. Please try again."
  statusCode={402}
  customAction={{
    label: "Retry Payment",
    onClick: () => retryPayment(),
  }}
/>
```

## Internationalization

All error messages and button labels are **automatically translated** based on the current locale using `next-international`. The components work both **inside and outside** the i18n context:

- **Inside `[locale]` routes**: Full internationalization with translated messages
- **Outside `[locale]` routes** (e.g., root `/app/error.tsx`): Falls back to English

### Using in Server Components (Recommended)

For full control over translations in server components, pass all labels as props:

```tsx
// app/[locale]/not-found.tsx
import { ErrorDisplay } from "@/components/error/error-display";
import { getI18n } from "@/locales/server";

export default async function NotFound() {
  const t = await getI18n();

  return (
    <ErrorDisplay
      type="page-not-found"
      title={t("page.not-found.title")}
      description={t("page.not-found.description")}
      homeButtonLabel={t("page.not-found.go-home")}
      backButtonLabel={t("page.not-found.go-back")}
    />
  );
}
```

### Using in Client Components

Client components can use `useI18n()` hook and pass translations as props, or rely on the component's internal i18n:

```tsx
"use client";

import { ErrorDisplay } from "@/components/error";
import { useI18n } from "@/locales/client";

export default function Error({ error, reset }) {
  const t = useI18n();

  return (
    <ErrorDisplay
      type="error"
      title={t("page.error.title")}
      description={t("page.error.description")}
      homeButtonLabel={t("page.error.go-home")}
      customAction={{
        label: t("page.error.try-again"),
        onClick: reset,
      }}
    />
  );
}
```

The components use `useSafeI18n` hook which gracefully handles cases where i18n is not available.

### Translation Keys

The following translation keys are available in your locale files ([locales/en.ts](locales/en.ts), [locales/pt-BR.ts](locales/pt-BR.ts)):

```typescript
page: {
  "not-found": {
    title: "Page not found",
    description: "Sorry, the page you are looking for does not exist.",
    "go-home": "Go to Home",
    "go-back": "Go Back",
  },
  "resource-not-found": {
    title: "Resource Not Found",
    description: "The resource or register you are looking for could not be found.",
    "go-back": "Go Back",
  },
  error: {
    title: "Something Went Wrong",
    description: "An unexpected error occurred. Please try again later.",
    "try-again": "Try Again",
    "go-home": "Go to Home",
  },
  // ... more error types
}
```

## Error Types

The following error types are available with default configurations:

- **page-not-found** (404): When a page doesn't exist
- **resource-not-found** (404): When a specific resource/register isn't found
- **error** (500): Generic server/application errors
- **unauthorized** (401): User needs to log in
- **forbidden** (403): User lacks permission

## Customization

You can customize the default configurations in [components/error/types.ts](components/error/types.ts).

## Technical Details

### Safe i18n Usage

The error components use a custom `useSafeI18n` hook ([lib/use-safe-i18n.ts](lib/use-safe-i18n.ts)) that wraps the standard `useI18n` hook. This allows the components to work both inside and outside the `I18nProvider` context:

```typescript
// Inside [locale] routes - returns i18n function
const t = useSafeI18n(); // t is available

// Outside [locale] routes (e.g., root error.tsx) - returns null
const t = useSafeI18n(); // t is null, components use English fallbacks
```

This pattern prevents the "`useI18n` must be used inside `I18nProvider`" error when using error components in root-level pages like `/app/error.tsx`.
