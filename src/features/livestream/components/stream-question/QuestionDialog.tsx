import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/src/shared/components/shadcn-ui/dialog";
import { Label } from "@/src/shared/components/shadcn-ui/label";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/src/shared/components/shadcn-ui/radio-group";
import { cn } from "@/src/shared/helpers/cn-tailwind";
import { Question } from "@/src/shared/types/question.type";
import { useState, useCallback } from "react";
import { addStar } from "../../api/star.api";
import { useAuthStore } from "@/src/shared/libs/zustand/auth.zustand";

interface QuestionDialogProps {
  open: boolean;
  question: Question;
  onSelectChoice: (choice: string) => void;
}

export const QuestionDialog = ({
  open,
  question,
  onSelectChoice,
}: QuestionDialogProps) => {
  const { endUser, setEndUser } = useAuthStore();
  const [selectedChoice, setSelectedChoice] = useState<string>("");
  const [hasAnswered, setHasAnswered] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const handleChoiceSelect = useCallback(
    async (choice: string) => {
      if (isProcessing || hasAnswered) return;

      setIsProcessing(true);
      setSelectedChoice(choice);
      setHasAnswered(true);

      const isAnswerCorrect = choice === question.answer;
      setIsCorrect(isAnswerCorrect);

      // Add delay before emitting the choice
      await new Promise((resolve) => setTimeout(resolve, 3000));
      onSelectChoice(choice);
      if (isAnswerCorrect) {
        // add star api
        await addStar(1, endUser, setEndUser);
      }
      setIsProcessing(false);
    },
    [hasAnswered, isProcessing, onSelectChoice],
  );

  const getChoiceStyles = (choice: string) => {
    if (!hasAnswered) return "";
    if (choice === question.answer) return "bg-green-500 text-white";
    if (choice === selectedChoice && choice !== question.answer)
      return "bg-red-500 text-white";
    return "";
  };

  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{question.question}</DialogTitle>
          {hasAnswered && isCorrect && (
            <div className="text-green-500 text-sm font-medium mt-2">
              Correct! You earned 1 star ⭐
            </div>
          )}
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <RadioGroup
            value={selectedChoice}
            onValueChange={handleChoiceSelect}
            disabled={hasAnswered || isProcessing}
          >
            {question.choices.map((choice, index) => (
              <div
                key={index}
                className={cn(
                  "flex items-center space-x-2 rounded-lg p-4 transition-colors",
                  getChoiceStyles(choice),
                )}
              >
                <RadioGroupItem value={choice} id={`choice-${index}`} />
                <Label
                  htmlFor={`choice-${index}`}
                  className="flex-grow cursor-pointer"
                >
                  {choice}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      </DialogContent>
    </Dialog>
  );
};
