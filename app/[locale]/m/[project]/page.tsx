import { DefaultLayout } from "@/components/layout/layout";
import { Section } from "@/components/layout/section";
import MdxEditor from "./mdx-editor";

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string; project: string }>;
}) {
  const { project } = await params;

  return (
    <DefaultLayout>
      <Section>
        <MdxEditor projectId={project} />
      </Section>
    </DefaultLayout>
  );
}
