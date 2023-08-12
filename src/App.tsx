import React, { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import Tracker from "./components/Tracker";
import MaterialPicker from "./components/MaterialPicker";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ProgressProvider } from "./context/ProgressContext";
import { AuthenticationGuard } from "./components/AuthGuard";

const queryClient = new QueryClient();

function App() {
  useEffect(() => {
    document.title = "Choku | Progress Tracker";
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ProgressProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/tracker"
            element={<AuthenticationGuard component={Tracker} />}
          />
          <Route
            path="/picker"
            element={<MaterialPicker isModalView={false} />}
          />
        </Routes>
      </ProgressProvider>
    </QueryClientProvider>
  );
}

export default App;
