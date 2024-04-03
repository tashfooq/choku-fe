import { useAuth } from "@clerk/clerk-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Banner from "./Banner";

const Home = () => {
  const { isSignedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    console.log(isSignedIn);
    if (isSignedIn) {
      navigate("/tracker");
    }
  }, [isSignedIn, navigate]);

  return <Banner />;
};

export default Home;
