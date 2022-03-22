import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import SignUp from "./components/SignUp";
import LogIn from "./components/LogIn";
import Tracker from "./components/Tracker";
import TrackerV2 from "./components/TrackerV2";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route index element={<Home />} />
          <Route path="home" element={<Home />} />
          <Route path="signup" element={<SignUp />} />
          <Route path="login" element={<LogIn />} />
          <Route path="tracker" element={<Tracker />} />
          <Route path="tracker2" element={<TrackerV2 />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
