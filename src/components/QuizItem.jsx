import { useLocation, useNavigate } from "react-router-dom";

import { useEffect, useState } from "react";

export default function QuizItem() {
  const [current, setCurrent] = useState(0);
  const [next, setNext] = useState(false);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [answer, setAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(20);
  const[answers,setAnswers]=useState([])


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
      .then((res) => res.json())
      .then((result) => {
        setData(result);
        setLoading(false);
      })
      .catch((e) => {
        console.error("Error fetching quiz data:", e);
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
    } else {
      navigate("/results");
    }
  };

  const handleQuit = () => {
    navigate("/");
  };
    const currentQuestion = data[current] ?? {};
    const incorrectAnswers = Array.isArray(currentQuestion.incorrectAnswers)
      ? currentQuestion.incorrectAnswers
      : [];
    const allanswers = currentQuestion
      ? [currentQuestion.correctAnswer, ...incorrectAnswers]
      : [];
  useEffect(()=>{
     setAnswers(shuffleArray(allanswers))
  },[current,data])
  
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
    return <h1>Loading....</h1>;
  }

  if (error) {
    return <h1>Error</h1>;
  }
  const end = current == data.length - 1 ? true : false;
  return (
    <div className={"m-20 border p-5 flex flex-col gap-10 "}>
      <div className={"flex justify-between p-5 border"}>
        <div className={"flex flex-col w-30"}>
          <span className={"text-xl"}>
            Category:
            {category && category}
          </span>
          <span className={"text-xl capitalize text-black"}>
            Question:
            {currentQuestion &&
              currentQuestion.question &&
              currentQuestion.question.text &&
              currentQuestion.question.text}
          </span>
        </div>
        <div className="w-30">
          <span className={"text-xl"}>Your score:{score}</span>
        </div>
        <div className={"flex flex-col justify-end items-end w-20"}>
          <span className={"text-black font-bold"}>Time left:{timeLeft}</span>
          <span className={"text-black font-bold"}>
            Questions {current + 1} of {limit}
          </span>
        </div>
      </div>
      <div className={"flex flex-col gap-3 justify-center items-center mx-24"}>
        {answers &&
          answers.map((ans) => (
            <div
              className={`block p-5 border rounded w-full text-center hover:bg-indigo-200 cursor-pointer ${
                next
                  ? ans === currentQuestion.correctAnswer
                    ? "bg-green-400 hover:bg-green-400"
                    : "bg-red-400 hover:bg-red-400"
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
          onClick={handleNextQuiz}
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
    </div>
  );
}
