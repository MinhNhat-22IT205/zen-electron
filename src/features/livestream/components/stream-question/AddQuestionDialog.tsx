import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/src/shared/components/shadcn-ui/dialog";
import { Input } from "@/src/shared/components/shadcn-ui/input";
import { Label } from "@/src/shared/components/shadcn-ui/label";
import { Question } from "@/src/shared/types/question.type";
import { PlusIcon } from "@radix-ui/react-icons";
import { Button } from "@/src/shared/components/shadcn-ui/button";
import { useQuestionStore } from "@/src/shared/libs/zustand/question.zustand";

interface AddQuestionDialogProps {
  isOpen: boolean;
  close: () => void;
  onAddQuestion: (question: Question) => void;
}

const AddQuestionDialog = ({
  isOpen,
  close,
  onAddQuestion,
}: AddQuestionDialogProps) => {
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);

  const addChoice = (choice: string) => {
    setCurrentQuestion((prev) => ({
      ...prev,
      choices: [...(prev?.choices || []), choice],
    }));
  };

  const setAnswer = (answer: string) => {
    setCurrentQuestion((prev) => ({
      ...prev,
      answer,
    }));
  };

  const handleSubmit = () => {
    if (currentQuestion) {
      onAddQuestion({
        ...currentQuestion,
        _id: new Date().getTime().toString(),
      });
      setCurrentQuestion(null);
      close();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={close}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Question</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div>
            <Label>Question</Label>
            <Input
              placeholder="Enter your question"
              value={currentQuestion?.question || ""}
              onChange={(e) =>
                setCurrentQuestion((prev) => ({
                  ...prev,
                  question: e.target.value,
                  choices: prev?.choices || [],
                }))
              }
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label>Choices</Label>
            {currentQuestion?.choices?.map((choice, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={choice}
                  onChange={(e) => {
                    const newChoices = [...(currentQuestion.choices || [])];
                    newChoices[index] = e.target.value;
                    setCurrentQuestion((prev) => ({
                      ...prev,
                      choices: newChoices,
                    }));
                  }}
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setAnswer(choice)}
                  className={
                    currentQuestion.answer === choice
                      ? "bg-green-500 text-white hover:bg-green-500"
                      : ""
                  }
                >
                  Set as Answer
                </Button>
              </div>
            ))}

            <Button
              variant="outline"
              size="sm"
              onClick={() => addChoice("")}
              disabled={
                !currentQuestion?.choices || currentQuestion.choices.length >= 6
              }
              className="w-full mt-2"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Add Choice
            </Button>

            {(!currentQuestion?.choices ||
              currentQuestion.choices.length < 2) && (
              <p className="text-sm text-red-500">
                At least 2 choices are required
              </p>
            )}
          </div>

          <DialogFooter>
            <Button
              disabled={
                !currentQuestion?.question ||
                !currentQuestion?.choices ||
                currentQuestion.choices.length < 2 ||
                !currentQuestion?.answer
              }
              onClick={handleSubmit}
            >
              Add Question
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddQuestionDialog;
