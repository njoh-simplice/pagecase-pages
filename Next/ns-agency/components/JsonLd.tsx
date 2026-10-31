import { buildJsonLd } from "@/lib/jsonld";

export default function JsonLd() {
  // "<" is escaped so the data can never close the script tag early.
  const json = JSON.stringify(buildJsonLd()).replace(/</g, "\\u003c");
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
