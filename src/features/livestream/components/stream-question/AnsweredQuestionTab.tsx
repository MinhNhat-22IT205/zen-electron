import { ScrollArea } from "@/src/shared/components/shadcn-ui/scroll-area";
import { cn } from "@/src/shared/helpers/cn-tailwind";
import { useQuestionStore } from "@/src/shared/libs/zustand/question.zustand";
import { Question } from "@/src/shared/types/question.type";

const AnsweredQuestionTab = () => {
  const { questions } = useQuestionStore();
  const answeredQuestions = questions.filter((q) => q.isAnswered);

  return (
    <div className="w-96 h-[91vh] bg-gray-800/95 backdrop-blur-sm">
      <ScrollArea className="h-full">
        <div className="flex flex-col gap-6 p-6">
          {answeredQuestions.map((question) => (
            <div
              key={question._id}
              className="bg-gray-700/50 border border-gray-600/30 rounded-xl p-6 shadow-lg hover:border-gray-500/50 transition-all duration-300"
            >
              <h3 className="text-lg font-semibold text-gray-100 mb-4">
                {question.question}
              </h3>
              <div className="flex flex-col gap-3">
                {question.choices.map((choice) => (
                  <div
                    key={choice}
                    className={cn(
                      "relative p-3 rounded-lg overflow-hidden transition-all duration-300",
                      choice === question.answer &&
                        "bg-green-500/20 border border-green-500/30",
                      choice === question.myAnswer &&
                        choice !== question.answer &&
                        "bg-red-500/20 border border-red-500/30",
                    )}
                  >
                    <div className="relative flex justify-between items-center">
                      <span className="text-gray-100 font-medium">
                        {choice}
                      </span>
                      {choice === question.answer && (
                        <span className="text-sm bg-green-500/20 text-green-300 px-3 py-1.5 rounded-full">
                          Correct Answer
                        </span>
                      )}
                      {choice === question.myAnswer &&
                        choice !== question.answer && (
                          <span className="text-sm bg-red-500/20 text-red-300 px-3 py-1.5 rounded-full">
                            Your Answer
                          </span>
                        )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          {answeredQuestions.length === 0 && (
            <div className="text-center text-gray-500 mt-8">
              No answered questions yet
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default AnsweredQuestionTab;
