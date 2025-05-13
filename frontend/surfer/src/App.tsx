import { TraceContextProvider } from "@context/TraceProvider";
import AppRouter from "@utils/AppRouter";

function App() {
  return (
    <TraceContextProvider>
      <AppRouter />
    </TraceContextProvider>
  );
}

export default App;
