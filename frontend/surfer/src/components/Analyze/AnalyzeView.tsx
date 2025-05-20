import { useEffect, useState } from "react";
import { marked } from "marked";

const AnalyzeView = ({ data }: { data: any }) => {
  if (!data || data === undefined) return <div> 코드를 분석해보세요</div>;

  const { rootMethod, executionTimeMs, analysisResult } = data.response;

  const [markdown, setMarkdown] = useState("");

  useEffect(() => {
    async function parseMarkdown() {
      const html = await marked.parse(`${analysisResult}`);
      setMarkdown(html);
    }
    parseMarkdown();
    setMarkdown(analysisResult);
  }, [analysisResult]);

  return (
    <div className="analysis">
      <div className="analysis-infos">
        <div className="root-method">
          <h3> Method Name: {rootMethod}</h3>
        </div>
        <div className="execution-time">
          <h3>ExecutionTime(ms): {executionTimeMs}</h3>
        </div>
      </div>

      <div
        dangerouslySetInnerHTML={{ __html: markdown }}
        className="markdown-body"
      />
    </div>
  );
};

export default AnalyzeView;
