import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Tracker from "./components/Tracker";
import Shell from "./components/Shell";
import { useEffect } from "react";
import { ProgressProvider } from "./context/ProgressContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { AuthProvider } from "./context/AuthContext";
import MaterialPicker from "./components/MaterialPicker";

const queryClient = new QueryClient();

function App() {
  useEffect(() => {
    document.title = "Choku";
  }, []);

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ProgressProvider>
            <BrowserRouter>
              <Routes>
                <Route index element={<Shell content={<Home />} />} />
                <Route path="home" element={<Shell content={<Home />} />} />
                <Route
                  path="picker"
                  element={
                    <Shell content={<MaterialPicker isModalView={false} />} />
                  }
                />
                <Route
                  path="tracker"
                  element={<Shell content={<Tracker />} />}
                />
              </Routes>
            </BrowserRouter>
          </ProgressProvider>
        </AuthProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </>
  );
}

export default App;
