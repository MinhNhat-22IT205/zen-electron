import { ChoiceStat, Question } from "@/src/shared/types/question.type";
import React, { useState } from "react";

const useStreamQuestion = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [choiceStats, setChoiceStats] = useState<ChoiceStat[]>([]);

  const getChoiceCount = (questionId: string, choice: string) => {
    return choiceStats.find(
      (stat) => stat.questionId === questionId && stat.choice === choice,
    )?.count;
  };

  const addChoiceCount = (questionId: string, choice: string) => {
    const existingStat = choiceStats.find(
      (stat) => stat.questionId === questionId && stat.choice === choice,
    );
    console.log("existingStat", existingStat, questionId, choice);

    setChoiceStats((prev) => {
      if (existingStat) {
        return prev.map((stat) =>
          stat.questionId === questionId && stat.choice === choice
            ? { ...stat, count: (stat.count ?? 0) + 1 }
            : stat,
        );
      }
      console.log([...prev, { questionId, choice, count: 1 }]);
      return [...prev, { questionId, choice, count: 1 }];
    });
    console.log("choiceStats", choiceStats);
  };
  const addQuestion = (question: Question) => {
    const existingQuestion = questions.find((q) => q._id === question._id);
    if (existingQuestion) {
      return;
    }
    setQuestions((prev) => [...prev, question]);
  };
  const setAnswer = (questionId: string, answer: string) => {
    setQuestions((prev) =>
      prev.map((question) =>
        question._id === questionId ? { ...question, answer } : question,
      ),
    );
  };
  const checkAnswer = (questionId: string, answer: string) => {
    return (
      questions.find((question) => question._id === questionId)?.answer ===
      answer
    );
  };
  const haveQuestionAvailable = () => {
    return questions.length > 0 && !questions[questions.length - 1].isAnswered;
  };
  const resetQuestions = () => {
    setQuestions([]);
  };
  const answerQuestion = (questionId: string, answer: string) => {
    setQuestions((prev) =>
      prev.map((question) =>
        question._id === questionId
          ? { ...question, isAnswered: true, myAnswer: answer }
          : question,
      ),
    );
  };

  return {
    questions,
    addQuestion,
    setAnswer,
    checkAnswer,
    resetQuestions,
    answerQuestion,
    haveQuestionAvailable,
    addChoiceCount,
    choiceStats,
    getChoiceCount,
  };
};

export default useStreamQuestion;
