import { site } from "@/content/site";
import { publicFileExists } from "@/lib/images";
import DocsModal from "./DocsModal";

/* Checks on the server which PDFs exist in public/, then renders the popup. */
export default function Docs() {
  const docs = (["resume", "cv"] as const).map((kind) => {
    const d = site.documents[kind];
    return { kind, ...d, available: publicFileExists(d.file) };
  });
  return <DocsModal docs={docs} />;
}
