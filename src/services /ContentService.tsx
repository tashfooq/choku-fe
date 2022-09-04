import axios from "axios";

// figure out a way to write the service layer so that I don't have to await these functions
export const getTextbooks = async () => {
    const res = await axios.get("http://localhost:3001/course/textbooks");
    return res;
}