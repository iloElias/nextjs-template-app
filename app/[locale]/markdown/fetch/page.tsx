import { DefaultLayout } from "@/components/layout/layout";
import MdxEditor from "./mdx-editor";
import { Section } from "@/components/layout/section";

export default function Page() {
  return (
    <DefaultLayout>
      <Section>
        <MdxEditor />
      </Section>
    </DefaultLayout>
  );
}
