import { marked } from "marked";
import readmeText from "@assets/README.md?raw";
import { useMemo } from "react";

const ReadMeViewer = () => {
  const html = useMemo(() => marked.parse(readmeText), [readmeText]);

  return (
    <div className="markdown-body" dangerouslySetInnerHTML={{ __html: html }} />
  );
};

export default ReadMeViewer;
