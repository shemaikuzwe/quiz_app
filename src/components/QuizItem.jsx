import { useEffect, useEffectEvent, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { Check, ChevronRight, Loader2, LogOut, RotateCcw, X } from "lucide-react";
import QuitDialog from "@/components/QuitDialog";
import Results from "@/components/Results";
import QuizImage from "@/components/Image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

const QUESTION_TIME = 20;
const REVEAL_DELAY = 1500;

const shuffle = (array) => {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

const formatLabel = (value = "") =>
  value.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

function Timer({ timeLeft }) {
  const radius = 22;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - timeLeft / QUESTION_TIME);
  const low = timeLeft <= 5;

  return (
    <div className="relative size-14" role="timer" aria-label={`${timeLeft} seconds left`}>
      <svg viewBox="0 0 52 52" className="size-full -rotate-90">
        <circle cx="26" cy="26" r={radius} className="fill-none stroke-muted" strokeWidth="5" />
        <circle
          cx="26"
          cy="26"
          r={radius}
          className={cn(
            "fill-none transition-[stroke-dashoffset] duration-1000 ease-linear",
            low ? "stroke-destructive" : "stroke-primary"
          )}
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <span
        className={cn(
          "absolute inset-0 flex items-center justify-center text-sm font-semibold tabular-nums",
          low && "text-destructive"
        )}
      >
        {timeLeft}
      </span>
    </div>
  );
}

export default function QuizItem() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const category = searchParams.get("category");
  const limit = searchParams.get("limit");
  const difficulty = searchParams.get("difficulty");

  const [data, setData] = useState([]);
  const [status, setStatus] = useState("loading");
  const [attempt, setAttempt] = useState(0);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME);
  const [showDialog, setShowDialog] = useState(false);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    const params = new URLSearchParams({ category, difficulty, limit });
    fetch(`https://the-trivia-api.com/v2/questions?${params}`, {
      signal: controller.signal,
    })
      .then((res) => res.json())
      .then((result) => {
        if (!Array.isArray(result) || result.length === 0) {
          throw new Error("No questions returned");
        }
        setData(result);
        setStatus("ready");
      })
      .catch((e) => {
        if (e.name !== "AbortError") setStatus("error");
      });
    return () => controller.abort();
  }, [category, limit, difficulty, attempt]);

  const currentQuestion = data[current];
  const answers = useMemo(
    () =>
      currentQuestion
        ? shuffle([currentQuestion.correctAnswer, ...(currentQuestion.incorrectAnswers ?? [])])
        : [],
    [currentQuestion]
  );

  const timedOut = timeLeft === 0;
  const revealed = selected !== null || timedOut;
  const isLast = current === data.length - 1;
  const progress = data.length ? ((current + 1) / data.length) * 100 : 0;

  const goNext = () => {
    if (isLast) {
      setShowResults(true);
      return;
    }
    setCurrent((c) => c + 1);
    setSelected(null);
    setTimeLeft(QUESTION_TIME);
  };

  const handleAnswer = (ans) => {
    if (revealed) return;
    setSelected(ans);
    if (ans === currentQuestion.correctAnswer) setScore((s) => s + 1);
  };

  // Count down while a question is unanswered and the quit dialog is closed
  useEffect(() => {
    if (status !== "ready" || revealed || showDialog) return;
    const timer = setInterval(() => setTimeLeft((t) => Math.max(t - 1, 0)), 1000);
    return () => clearInterval(timer);
  }, [status, revealed, showDialog, current]);

  // When time runs out, briefly reveal the answer and move on automatically
  const onTimeout = useEffectEvent(goNext);
  useEffect(() => {
    if (!timedOut) return;
    const id = setTimeout(onTimeout, REVEAL_DELAY);
    return () => clearTimeout(id);
  }, [timedOut, current]);

  const handleRetry = () => {
    setStatus("loading");
    setAttempt((a) => a + 1);
  };

  const handleQuizQuit = () => navigate("/");

  if (status === "loading") {
    return (
      <div className="flex flex-col items-center justify-center gap-6">
        <QuizImage />
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="size-5 animate-spin text-primary" />
          Loading questions…
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <Card className="w-full max-w-md items-center text-center">
        <CardContent className="flex flex-col items-center gap-4">
          <QuizImage />
          <p className="text-xl font-semibold">Something went wrong</p>
          <p className="text-sm text-muted-foreground">
            We couldn&apos;t load questions. Check your connection and try again.
          </p>
          <div className="flex gap-3">
            <Button variant="outline" onClick={handleQuizQuit}>
              Back home
            </Button>
            <Button onClick={handleRetry}>
              <RotateCcw />
              Try again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full shadow-xl shadow-primary/10">
      <CardHeader className="gap-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-col gap-2">
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">{formatLabel(category)}</Badge>
              <Badge variant="outline">{formatLabel(difficulty)}</Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              Question <span className="font-semibold text-foreground">{current + 1}</span> of{" "}
              {data.length} · Score{" "}
              <span className="font-semibold text-foreground">{score}</span>
            </p>
          </div>
          <Timer timeLeft={timeLeft} />
        </div>
        <Progress value={progress} aria-label="Quiz progress" />
      </CardHeader>

      <CardContent className="flex flex-col gap-6">
        <h2 className="text-xl font-semibold leading-snug text-balance sm:text-2xl">
          {currentQuestion?.question?.text}
        </h2>

        <div className="grid gap-3 sm:grid-cols-2">
          {answers.map((ans, i) => {
            const isCorrect = ans === currentQuestion.correctAnswer;
            const isWrongPick = ans === selected && !isCorrect;
            return (
              <button
                type="button"
                key={ans}
                onClick={() => handleAnswer(ans)}
                disabled={revealed}
                className={cn(
                  "group flex items-center gap-3 rounded-lg border bg-background p-4 text-left text-sm font-medium transition-all outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50",
                  !revealed && "cursor-pointer hover:-translate-y-0.5 hover:border-primary hover:bg-accent hover:shadow-sm",
                  revealed && isCorrect && "border-success bg-success/10 text-success",
                  revealed && isWrongPick && "border-destructive bg-destructive/10 text-destructive",
                  revealed && !isCorrect && !isWrongPick && "opacity-60"
                )}
              >
                <span
                  className={cn(
                    "flex size-7 shrink-0 items-center justify-center rounded-md bg-muted text-xs font-semibold text-muted-foreground",
                    revealed && isCorrect && "bg-success text-white",
                    revealed && isWrongPick && "bg-destructive text-white"
                  )}
                >
                  {revealed && isCorrect ? (
                    <Check className="size-4" />
                  ) : revealed && isWrongPick ? (
                    <X className="size-4" />
                  ) : (
                    String.fromCharCode(65 + i)
                  )}
                </span>
                <span>{ans}</span>
              </button>
            );
          })}
        </div>

        {timedOut && selected === null && (
          <p className="text-center text-sm font-medium text-destructive">
            Time&apos;s up! Moving on…
          </p>
        )}
      </CardContent>

      <CardFooter className="flex-col-reverse gap-3 border-t sm:flex-row sm:justify-between">
        <Button variant="ghost" className="text-destructive hover:text-destructive" onClick={() => setShowDialog(true)}>
          <LogOut />
          Quit quiz
        </Button>
        <Button disabled={!revealed} onClick={goNext} className="w-full sm:w-auto">
          {isLast ? "View results" : "Next question"}
          <ChevronRight />
        </Button>
      </CardFooter>

      <QuitDialog
        isOpen={showDialog}
        onConfirm={handleQuizQuit}
        onClose={() => setShowDialog(false)}
      />
      <Results
        isOpen={showResults}
        onPlay={handleQuizQuit}
        onClose={() => setShowResults(false)}
        result={{ score, total: data.length }}
      />
    </Card>
  );
}
