"use client";

import { MDXEditorComponent } from "@/components/markdown/mdx-editor";
import { useScopedI18n } from "@/locales/client";

const TERMS_OF_SERVICE_MARKDOWN = `# Terms of Service

**Last updated: May 10, 2026**

Please read these Terms of Service ("Terms") carefully before using our platform. By accessing or using our services, you agree to be bound by these Terms.

## 1. Acceptance of Terms

By creating an account or using our platform in any way, you confirm that you are at least 13 years of age and agree to these Terms. If you do not agree, you must not use our services.

## 2. Description of Services

We provide a platform that allows users to create, manage, and share content. Features may include text editors, collaborative tools, file storage, and other productivity utilities. We reserve the right to modify, suspend, or discontinue any feature at any time.

## 3. User Accounts

### 3.1 Registration

To access certain features, you must register for an account. You agree to:

- Provide accurate, current, and complete information.
- Maintain and promptly update your account information.
- Keep your password confidential.
- Notify us immediately of any unauthorized use of your account.

### 3.2 Account Responsibility

You are responsible for all activities that occur under your account. We are not liable for any loss or damage arising from your failure to comply with these obligations.

## 4. Acceptable Use

You agree not to use our platform to:

- Violate any applicable laws or regulations.
- Infringe upon the intellectual property rights of others.
- Upload or transmit harmful, offensive, or illegal content.
- Attempt to gain unauthorized access to our systems or other users' accounts.
- Distribute spam, malware, or any other malicious software.
- Engage in any activity that disrupts or interferes with our services.

## 5. Content Ownership

### 5.1 Your Content

You retain ownership of any content you create or upload to our platform. By submitting content, you grant us a non-exclusive, worldwide, royalty-free license to use, store, display, and distribute it solely for the purpose of providing our services.

### 5.2 Our Content

All content provided by us, including logos, designs, text, and software, is protected by intellectual property laws and remains our exclusive property.

## 6. Privacy

Your use of our services is subject to our [Privacy Policy](/legal/privacy-policy), which is incorporated into these Terms by reference. Please review it carefully.

## 7. Payments and Subscriptions

If you subscribe to a paid plan:

- Fees are charged in advance on a monthly or annual basis.
- All payments are non-refundable unless required by applicable law.
- We may change our pricing with 30 days' notice.
- Failure to pay may result in suspension or termination of your account.

## 8. Termination

We reserve the right to suspend or terminate your account at our discretion if you:

- Violate these Terms.
- Engage in fraudulent or illegal activities.
- Create risk or legal exposure for us.

You may also terminate your account at any time by contacting us or using the account deletion option in your settings.

## 9. Disclaimers

Our services are provided "as is" without warranties of any kind, either express or implied. We do not warrant that:

- The platform will be error-free or uninterrupted.
- Results obtained through the platform will be accurate or reliable.
- Any defects will be corrected.

## 10. Limitation of Liability

To the fullest extent permitted by law, we shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of our services, even if we have been advised of the possibility of such damages.

## 11. Indemnification

You agree to indemnify and hold harmless our company and its officers, directors, employees, and agents from any claims, damages, or expenses arising from your use of our services or violation of these Terms.

## 12. Governing Law

These Terms shall be governed by and construed in accordance with applicable laws, without regard to conflict of law principles.

## 13. Changes to Terms

We may update these Terms at any time. We will notify you of material changes by posting a notice on our platform or via email. Your continued use of the platform after changes take effect constitutes your acceptance.

## 14. Contact Us

If you have questions about these Terms, please contact us:

- **Email**: legal@example.com
- **Address**: 123 Main Street, City, State, ZIP Code
`;

export default function TermsOfServiceContent() {
  const t = useScopedI18n("legal.terms-of-service");

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold">{t("title")}</h1>
        <p className="text-sm">{t("lastUpdated")}</p>
      </div>
      <MDXEditorComponent
        markdown={TERMS_OF_SERVICE_MARKDOWN}
        readOnly
        contentEditableClassName="text-red!"
      />
    </div>
  );
}
