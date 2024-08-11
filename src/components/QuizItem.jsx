import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { CircularProgress } from "@nextui-org/react";
import { Progress } from "@nextui-org/react";
import Dialog from "./modal";
import Results from "./Results";
export default function QuizItem() {
  const [current, setCurrent] = useState(0);
  const [next, setNext] = useState(false);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [answer, setAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(20);
  const [answers, setAnswers] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState([]);

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const navigate = useNavigate();
  const category = searchParams.get("category");
  const limit = searchParams.get("limit");
  const difficulty = searchParams.get("difficulty");
  const ref=useRef(null);
  const getQuiz = async () => {
    setLoading(true);
    fetch(
      `https://the-trivia-api.com/v2/questions?category=${category}&difficulty=${difficulty}&limit=${limit}`
    )
      .then((res) => res.json())
      .then((result) => {
        setData(result);
        setLoading(false);
      })
      .catch((e) => {
        setError(e);
        setLoading(false);
      });
  };
  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const handleNext = (answer) => {
    setAnswer(answer);
    if (answer == currentQuestion.correctAnswer) {
      setScore(score + 1);
    }
    setNext(true);
  };

  const handleNextQuiz = () => {
    if (current < data.length - 1) {
      setCurrent(current + 1);
      setAnswer(null);
      setNext(false);
      setTimeLeft(20);
    }
  };

  const handleQuit = () => {
    setShowDialog(true);
  };
  const handleQuizQuit = () => {
    navigate("/");
  };
  const handleShowResult = () => {
    setResults({
      score: score,
      limit: limit,
    });
    setShowResults(true);
  };

  const currentQuestion = data[current] ?? {};
  const incorrectAnswers = Array.isArray(currentQuestion.incorrectAnswers)
    ? currentQuestion.incorrectAnswers
    : [];
  const allanswers = currentQuestion
    ? [currentQuestion.correctAnswer, ...incorrectAnswers]
    : [];
  useEffect(() => {
    setAnswers(shuffleArray(allanswers));
  }, [current, data]);

  useEffect(() => {
    getQuiz().then().catch();
  }, [category, limit, difficulty]);
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          handleNext(null);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [current]);
  if (loading) {
    return (
      <div className="flex gap-4 justify-center items-center mt-56">
        <CircularProgress color="primary" aria-label="Loading..." size="lg" />
      </div>
    );
  }

  if (error) {
    return <h1>Error</h1>;
  }
  const end = current == data.length - 1;
  const progress=(current +1/limit)*100;
  return (
    <div className={"m-20 border p-5 flex flex-col gap-10 rounded"}>
      <Progress size="md" aria-label="Loading..." value={progress} />
      <div className={"flex justify-between p-3"}>
        <div className={"flex flex-col w-30"}>
          <span className={"text-xl"}>
            Category:
            {category && category}
          </span>
          <span>Your score :{score}</span>
        </div>
        <div className={"flex flex-col justify-end items-end w-20"}>
          <span className={"text-black font-bold"}>
            {" "}
            <CircularProgress
              aria-label="Loading..."
              size="lg"
              value={timeLeft}
              color="warning"
              showValueLabel={true}
              formatOptions={{ style: "decimal" }}
            />
          </span>
        </div>
      </div>
      <div className="flex justify-center items-center border-b-1 p-4">
        <span className={"text-xl capitalize text-black"}>
          Question:
          {currentQuestion &&
            currentQuestion.question &&
            currentQuestion.question.text &&
            currentQuestion.question.text}
        </span>
      </div>
      <div className={"flex flex-col gap-3 justify-center items-center mx-24"}>
        {answers &&
          answers.map((ans) => (
            <div
              className={`block p-5 border rounded w-full text-center cursor-pointer ${
                !next ? "hover:bg-indigo-200" : ""
              } ${
                next
                  ? ans === currentQuestion.correctAnswer
                    ? "bg-green-400 hover:bg-green-400"
                    : ans === answer
                    ? "bg-red-400 hover:bg-red-400"
                    : ""
                  : ""
              }`}
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
          onClick={end ? handleShowResult : handleNextQuiz}
          className={
            "block px-5 py-1.5 bg-indigo-700 text-white rounded disabled:cursor-not-allowed disabled:bg-indigo-500"
          }
        >
          {end ? "View results" : "Next question"}
        </button>
        <button
          onClick={handleQuit}
          className={"block px-5 py-1.5 bg-red-600 text-white rounded"}
        >
          Quit quiz
        </button>
      </div>
      {showDialog && (
        <Dialog
          onConfirm={handleQuizQuit}
          isOpen={showDialog}
          onClose={() => setShowDialog(false)}
        />
      )}
      {showResults && (
        <Results
          onPlay={handleQuizQuit}
          isOpen={showResults}
          onClose={() => setShowResults(false)}
          result={results}
        />
      )}
    </div>
  );
}
