import { useState } from "react";
import { useNavigate } from "react-router";
import { Play } from "lucide-react";
import QuizImage from "@/components/Image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

const levels = [
  { value: "easy", name: "Easy" },
  { value: "medium", name: "Medium" },
  { value: "hard", name: "Hard" },
];

const categories = [
  { value: "history", name: "History" },
  { value: "general_knowledge", name: "General Knowledge" },
  { value: "science", name: "Science" },
  { value: "music", name: "Music" },
  { value: "society_and_culture", name: "Society and Culture" },
  { value: "geography", name: "Geography" },
];

const Intro = () => {
  const navigate = useNavigate();
  const [category, setCategory] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [limit, setLimit] = useState(5);

  const canSubmit = category !== "" && difficulty !== "";

  const handleSubmit = (e) => {
    e.preventDefault();
    if (canSubmit) {
      const params = new URLSearchParams({ category, limit, difficulty });
      navigate(`/questions?${params}`);
    }
  };

  return (
    <Card className="w-full max-w-md shadow-xl shadow-primary/10">
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <CardHeader className="justify-items-center text-center">
          <QuizImage className="mb-2" />
          <CardTitle className="text-3xl font-bold tracking-tight">Quiz App</CardTitle>
          <CardDescription>
            Pick a topic and difficulty, then race the clock.
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label htmlFor="category" className="text-sm font-medium">
              Category
            </label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger id="category" className="w-full">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="difficulty" className="text-sm font-medium">
              Difficulty
            </label>
            <Select value={difficulty} onValueChange={setDifficulty}>
              <SelectTrigger id="difficulty" className="w-full">
                <SelectValue placeholder="Select difficulty" />
              </SelectTrigger>
              <SelectContent>
                {levels.map((level) => (
                  <SelectItem key={level.value} value={level.value}>
                    {level.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">Total questions</span>
              <span className="rounded-md bg-secondary px-2 py-0.5 font-semibold tabular-nums text-secondary-foreground">
                {limit}
              </span>
            </div>
            <Slider
              aria-label="Total questions"
              min={5}
              max={50}
              step={1}
              value={[limit]}
              onValueChange={([value]) => setLimit(value)}
            />
          </div>
        </CardContent>

        <CardFooter>
          <Button type="submit" size="lg" className="w-full" disabled={!canSubmit}>
            <Play />
            Start Quiz
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default Intro;
