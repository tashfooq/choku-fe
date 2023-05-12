import React, { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import Tracker from "./components/Tracker";
import MaterialPicker from "./components/MaterialPicker";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ProgressProvider } from "./context/ProgressContext";

const queryClient = new QueryClient();

function App() {
  useEffect(() => {
    document.title = "Choku | Progress Tracker";
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ProgressProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/tracker" element={<Tracker />} />
            <Route
              path="/picker"
              element={<MaterialPicker isModalView={false} />}
            />
          </Routes>
        </BrowserRouter>
      </ProgressProvider>
    </QueryClientProvider>
  );
}

export default App;
