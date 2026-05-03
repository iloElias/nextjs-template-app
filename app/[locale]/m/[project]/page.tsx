import { DefaultLayout } from "@/components/layout/layout";
import MdxEditor from "./mdx-editor";

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string; project: string }>;
}) {
  const { project } = await params;

  return (
    <DefaultLayout hideHeader>
      <section className="container mx-auto px-6 py-4">
        <MdxEditor projectId={project} />
      </section>
    </DefaultLayout>
  );
}
