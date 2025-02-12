import { Question, ChoiceStat } from "@/src/shared/types/question.type";
import { create } from "zustand";

interface QuestionState {
  questions: Question[];
  choiceStats: ChoiceStat[];
  addQuestion: (question: Question) => void;
  setAnswer: (questionId: string, answer: string) => void;
  checkAnswer: (questionId: string, answer: string) => boolean;
  resetQuestions: () => void;
  answerQuestion: (questionId: string, answer: string) => void;
  haveQuestionAvailable: () => boolean;
  addChoiceCount: (questionId: string, choice: string) => void;
  getChoiceCount: (questionId: string, choice: string) => number;
}

export const useQuestionStore = create<QuestionState>((set, get) => ({
  questions: [],
  choiceStats: [],

  addQuestion: (question: Question) => {
    set((state) => {
      const existingQuestion = state.questions.find(
        (q) => q._id === question._id,
      );
      if (existingQuestion) return state;
      return { questions: [...state.questions, question] };
    });
  },

  setAnswer: (questionId: string, answer: string) => {
    set((state) => ({
      questions: state.questions.map((question) =>
        question._id === questionId ? { ...question, answer } : question,
      ),
    }));
  },

  checkAnswer: (questionId: string, answer: string) => {
    const state = get();
    return (
      state.questions.find((question) => question._id === questionId)
        ?.answer === answer
    );
  },

  resetQuestions: () => {
    set({ questions: [], choiceStats: [] });
  },

  answerQuestion: (questionId: string, answer: string) => {
    set((state) => ({
      questions: state.questions.map((question) =>
        question._id === questionId
          ? { ...question, isAnswered: true, myAnswer: answer }
          : question,
      ),
    }));
  },

  haveQuestionAvailable: () => {
    const state = get();
    return (
      state.questions.length > 0 &&
      !state.questions[state.questions.length - 1].isAnswered
    );
  },

  addChoiceCount: (questionId: string, choice: string) => {
    set((state) => {
      const existingStat = state.choiceStats.find(
        (stat) => stat.questionId === questionId && stat.choice === choice,
      );

      if (existingStat) {
        return {
          choiceStats: state.choiceStats.map((stat) =>
            stat.questionId === questionId && stat.choice === choice
              ? { ...stat, count: (stat.count ?? 0) + 1 }
              : stat,
          ),
        };
      }

      return {
        choiceStats: [...state.choiceStats, { questionId, choice, count: 1 }],
      };
    });
  },

  getChoiceCount: (questionId: string, choice: string) => {
    const state = get();
    return (
      state.choiceStats.find(
        (stat) => stat.questionId === questionId && stat.choice === choice,
      )?.count ?? 0
    );
  },
}));
