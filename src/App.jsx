import { Routes, Route } from "react-router";
import Intro from "@/components/Intro";
import QuizItem from "@/components/QuizItem";

function App() {
  return (
    <main className="mx-auto flex min-h-svh w-full max-w-3xl items-center justify-center p-4 sm:p-8">
      <Routes>
        <Route path="/" element={<Intro />} />
        <Route path="/questions" element={<QuizItem />} />
      </Routes>
    </main>
  );
}

export default App;
