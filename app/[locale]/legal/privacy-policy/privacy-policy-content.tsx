"use client";

import { MDXEditorComponent } from "@/components/markdown/mdx-editor";
import { useScopedI18n } from "@/locales/client";

const PRIVACY_POLICY_MARKDOWN = `# Privacy Policy

**Last updated: May 10, 2026**

Welcome to our platform. We are committed to protecting your privacy and handling your personal data with transparency and care. This Privacy Policy describes how we collect, use, and safeguard your information when you use our services.

## 1. Information We Collect

We may collect the following types of information:

### 1.1 Information You Provide

- **Account Information**: Name, email address, and password when you register.
- **Profile Information**: Optional details you choose to add to your profile.
- **Communications**: Messages or feedback you send us.

### 1.2 Information Collected Automatically

- **Usage Data**: Pages visited, features used, time spent on the platform.
- **Device Information**: Browser type, operating system, IP address.
- **Cookies**: Small data files stored on your device to enhance your experience.

## 2. How We Use Your Information

We use the information we collect to:

- Provide, maintain, and improve our services.
- Create and manage your account.
- Send you important updates and notifications.
- Respond to your requests and provide customer support.
- Ensure the security and integrity of our platform.
- Comply with legal obligations.

## 3. Sharing of Information

We do not sell your personal information. We may share your information with:

- **Service Providers**: Third-party vendors who assist us in operating our platform (e.g., hosting, analytics).
- **Legal Requirements**: When required by law or to protect our rights.
- **Business Transfers**: In connection with a merger, acquisition, or sale of assets.

## 4. Data Retention

We retain your personal data only for as long as necessary to fulfill the purposes described in this policy, unless a longer retention period is required by law.

## 5. Your Rights

Depending on your location, you may have the following rights:

- **Access**: Request a copy of the personal data we hold about you.
- **Correction**: Request correction of inaccurate or incomplete data.
- **Deletion**: Request deletion of your personal data.
- **Portability**: Request a machine-readable copy of your data.
- **Objection**: Object to certain types of processing.

To exercise any of these rights, please contact us at **privacy@example.com**.

## 6. Security

We implement industry-standard security measures to protect your data, including encryption, access controls, and regular security assessments. However, no method of transmission over the internet is 100% secure.

## 7. Cookies

We use cookies and similar tracking technologies to enhance your experience. You can control cookie settings through your browser preferences. Disabling cookies may affect certain features of our platform.

## 8. Third-Party Links

Our platform may contain links to third-party websites. We are not responsible for the privacy practices of those sites and encourage you to read their privacy policies.

## 9. Children's Privacy

Our services are not directed to individuals under the age of 13. We do not knowingly collect personal information from children. If you believe we have inadvertently collected such data, please contact us immediately.

## 10. Changes to This Policy

We may update this Privacy Policy from time to time. We will notify you of significant changes by posting a notice on our platform or sending you an email. Your continued use of our services after changes become effective constitutes acceptance of the updated policy.

## 11. Contact Us

If you have any questions about this Privacy Policy, please contact us:

- **Email**: privacy@example.com
- **Address**: 123 Main Street, City, State, ZIP Code
`;

export default function PrivacyPolicyContent() {
  const t = useScopedI18n("legal.privacy-policy");

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold text-foreground">{t("title")}</h1>
        <p className="text-sm text-default-400">{t("lastUpdated")}</p>
      </div>
      <MDXEditorComponent
        markdown={PRIVACY_POLICY_MARKDOWN}
        readOnly
        contentEditableClassName="prose-sm"
      />
    </div>
  );
}
