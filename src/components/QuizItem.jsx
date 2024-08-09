import { useLocation, useNavigate, useParams } from "react-router-dom";

import { useEffect, useState } from "react";

export default function QuizItem() {
  const [current, setCurrent] = useState(0);
  const [next, setNext] = useState(false);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [answer, setAnswer] = useState(null);

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const navigate = useNavigate();
  const category = searchParams.get("category");
  const limit = searchParams.get("limit");
  const difficulty = searchParams.get("difficulty");

  const getQuiz = async () => {
    setLoading(true);
    fetch(
      `https://the-trivia-api.com/v2/questions?category=${category}&difficulty=${difficulty}&limit=${limit}`
    )
      .then((res) => res.json()) // Convert the response to JSON
      .then((result) => {
        console.log("API Response:", result); // Log the response to check the data
        setData(result); // Set the data in state
        setLoading(false); // Set loading to false after data is set
      })
      .catch((e) => {
        console.error("Error fetching quiz data:", e); // Log the error if fetch fails
        setLoading(false); // Ensure loading is set to false if there's an error
      });
  };

  const handleNext = (answer) => {
    setAnswer(answer);
    setNext(true);
  };

  const handleNextQuiz = () => {
    if (current < data.length - 1) {
      setCurrent(current + 1);
      setAnswer(null);
      setNext(false);
    }
  };

  const handleQuit = () => {
    navigate("/");
  };

  useEffect(() => {
    getQuiz().then().catch();
  }, [category, limit, difficulty]);

  if (loading) {
    return <h1>Loading....</h1>;
  }

  if (error) {
    return <h1>Error</h1>;
  }

  const currentQuestion = data[current] ?? {};
  const incorrectAnswers = Array.isArray(currentQuestion.incorrectAnswers)
    ? currentQuestion.incorrectAnswers
    : [];
  const answers = currentQuestion
    ? [currentQuestion.correctAnswer, ...incorrectAnswers]
    : [];
  return (
    <div className={"m-20 border p-5 flex flex-col gap-10 "}>
      <div className={"flex justify-between p-5 border"}>
        <div className={"flex flex-col"}>
          <span className={"text-xl"}>
            Category:
            {currentQuestion &&
              currentQuestion.category &&
              currentQuestion.category}
          </span>
          <span className={"text-2xl font-bold capitalize text-black"}>
            Question:
            {currentQuestion &&
              currentQuestion.question &&
              currentQuestion.question.text &&
              currentQuestion.question.text}
          </span>
        </div>
        <div className={"flex flex-col justify-end items-end"}>
          <span className={"text-black font-bold"}>Time left:20</span>
          <span className={"text-black font-bold"}>
            Questions {current + 1} of {limit}
          </span>
        </div>
      </div>
      <div className={"flex flex-col gap-3 justify-center items-center mx-24"}>
        {answers &&
          answers.map((ans) => (
            <div
              className={`block p-5 border rounded w-full text-center hover:bg-indigo-200 cursor-pointer ${next ? (ans === currentQuestion.correctAnswer ? "bg-green-400 hover:bg-green-400" : "bg-red-400 hover:bg-red-400") : ""}`}
              onClick={() => handleNext(ans)}
              key={ans}
            >
              <span>{ans}</span>
            </div>
          ))}
      </div>
      <div className={"flex gap-5 justify-center items-center"}>
        <button
          disabled={!next}
          onClick={handleNextQuiz}
          className={
            "block px-5 py-1.5 bg-indigo-700 text-white rounded disabled:cursor-not-allowed disabled:bg-indigo-500"
          }
        >
          Next Question
        </button>
        <button
          onClick={handleQuit}
          className={"block px-5 py-1.5 bg-red-600 text-white rounded"}
        >
          Quit quiz
        </button>
      </div>
    </div>
  );
}
