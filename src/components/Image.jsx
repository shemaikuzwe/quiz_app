import quizImage from "@/assets/image2.png";
import { cn } from "@/lib/utils";

export default function QuizImage({ className }) {
  return (
    <div className={cn("flex items-center justify-center", className)}>
      <img src={quizImage} alt="Quiz illustration" width={220} height={220} className="h-auto w-40 sm:w-52" />
    </div>
  );
}
