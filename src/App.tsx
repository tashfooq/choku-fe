import React, { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import Tracker from "./components/Tracker";
import MaterialPicker from "./components/MaterialPicker";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ProgressProvider } from "./context/ProgressContext";
import { AuthenticationGuard } from "./components/AuthGuard";
import { AppShell } from "@mantine/core";
import HeaderMenu from "./components/Header";
import { useLocation } from "react-router-dom";

const queryClient = new QueryClient();

function App() {
  useEffect(() => {
    document.title = "Choku | Progress Tracker";
  }, []);

  const { pathname } = useLocation();

  return (
    <QueryClientProvider client={queryClient}>
      <ProgressProvider>
        <AppShell
          header={<HeaderMenu />}
          hidden={!["/tracker", "/picker"].includes(pathname)}
        >
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
        </AppShell>
      </ProgressProvider>
    </QueryClientProvider>
  );
}

export default App;
