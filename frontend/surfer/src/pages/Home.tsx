import PageTitle from "@components/common/PageTitle";
import ReadMeViewer from "@components/common/ReadMeViewer";

function Home() {
  const readme = "/k6mt-surfer/public/README-KO.md";
  return (
    <>
      <PageTitle title="" />
      <ReadMeViewer filePath={readme} />
    </>
  );
}

export default Home;
