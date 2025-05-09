import ApiBox from "@components/scanner/ApiBox";
import { useScan } from "@hooks/useScan";
import { useEffect } from "react";

const ScannerList = ({
  onApiClick,
}: {
  onApiClick: (method: string, url: string) => void;
}) => {
  const { apis, ApiScan, loading } = useScan();

  useEffect(() => {
    ApiScan();
  }, []);

  return (
    <div className="scanner-list">
      {loading ? (
        <p>로딩 중...</p>
      ) : apis ? (
        apis.map((api: any) => (
          <ApiBox
            key={api.url}
            method={api.method}
            url={api.url}
            onClick={() => onApiClick(api.method, api.url)}
          />
        ))
      ) : (
        <p className="scanner-list-none">No Scanned API</p>
      )}
    </div>
  );
};

export default ScannerList;
