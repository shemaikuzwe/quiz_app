import "./App.css";
import Intro from "./components/Intro";
import { Routes, Route } from "react-router-dom";
import QuizItem from "./components/QuizItem.jsx";
function App() {
  return (
    <main>
      <Routes>
        <Route path={"/"} element={<Intro />} />
        <Route path={"/questions"} element={<QuizItem />} />
      </Routes>
    </main>
  );
}

export default App;
