import { useEffect, useState } from "react";
import { marked } from "marked";

const ReadMeViewer = ({ filePath }: { filePath: string }) => {
  const [markdown, setMarkdown] = useState("");

  useEffect(() => {
    fetch(filePath)
      .then((res) => res.text())
      .then((text) => marked.parse(text))
      .then((html) => setMarkdown(html));
  }, [filePath]);

  return (
    <div
      dangerouslySetInnerHTML={{ __html: markdown }}
      className="markdown-body"
    />
  );
};

export default ReadMeViewer;
