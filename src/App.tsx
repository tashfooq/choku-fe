import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import SignUp from "./components/SignUp";
import LogIn from "./components/LogIn";
import Tracker from "./components/Tracker";
import Shell from "./components/Shell";
import { useEffect } from "react";

function App() {
  useEffect(() => {
    document.title = "Choku";
  }, []);
  return (
    <>
      {/* <Shell content={<Tracker />}/> */}
      <BrowserRouter>
        <Routes>
          <Route index element={<Shell content={<Home />} />} />
          <Route path="home" element={<Shell content={<Home />} />} />
          <Route path="signup" element={<SignUp />} />
          <Route path="login" element={<LogIn />} />
          {/* <Route path="tracker" element={<Tracker />} /> */}
          <Route path="tracker" element={<Shell content={<Tracker />} />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
