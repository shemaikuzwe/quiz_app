import { Trophy } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const getMessage = (percent) => {
  if (percent === 100) return "Perfect score — flawless!";
  if (percent >= 80) return "Excellent work!";
  if (percent >= 50) return "Nice job, keep it up!";
  return "Keep practicing, you'll get there.";
};

export default function Results({ isOpen, onClose, onPlay, result }) {
  const percent = result.total ? Math.round((result.score / result.total) * 100) : 0;

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-primary/10 text-primary">
            <Trophy />
          </AlertDialogMedia>
          <AlertDialogTitle>Quiz results</AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="flex flex-col items-center gap-1">
              <span className="text-4xl font-bold tabular-nums text-foreground">
                {result.score}/{result.total}
              </span>
              <span>
                {percent}% · {getMessage(percent)}
              </span>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="grid-cols-1!">
          <AlertDialogAction onClick={onPlay}>Play again</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
