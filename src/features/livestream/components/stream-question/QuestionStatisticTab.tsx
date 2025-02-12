import { cn } from "@/src/shared/helpers/cn-tailwind";
import { useQuestionStore } from "@/src/shared/libs/zustand/question.zustand";

const QuestionStatisticTab = () => {
  const { questions, getChoiceCount } = useQuestionStore();

  const getTotalVotes = (questionId: string) => {
    return (
      questions
        .find((q) => q._id === questionId)
        ?.choices.reduce(
          (acc, choice) => acc + (getChoiceCount(questionId, choice) || 0),
          0,
        ) || 0
    );
  };

  return (
    <div className="w-96 h-[91vh] bg-gray-800/95 backdrop-blur-sm overflow-y-auto">
      <div className="flex flex-col gap-6 p-6">
        {questions.map((question) => {
          const totalVotes = getTotalVotes(question._id);
          return (
            <div
              key={question._id}
              className="bg-gray-700/50 border border-gray-600/30 rounded-xl p-6 shadow-lg hover:border-gray-500/50 transition-all duration-300"
            >
              <h3 className="text-lg font-semibold text-gray-100 mb-4">
                {question.question}
              </h3>
              <div className="flex flex-col gap-3">
                {question.choices.map((choice) => {
                  const voteCount = getChoiceCount(question._id, choice);
                  const percentage =
                    totalVotes > 0 ? (voteCount / totalVotes) * 100 : 0;
                  return (
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
                      <div
                        className={cn(
                          "absolute top-0 left-0 h-full transition-all duration-500",
                          choice === question.answer
                            ? "bg-green-500"
                            : "bg-blue-500",
                        )}
                        style={{ width: `${percentage}%`, opacity: 0.1 }}
                      />
                      <div className="relative flex justify-between items-center">
                        <span className="text-gray-100 font-medium">
                          {choice}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm bg-gray-800/50 text-gray-300 px-3 py-1.5 rounded-full">
                            {voteCount}
                          </span>
                          <span className="text-sm bg-gray-800/50 text-gray-300 px-3 py-1.5 rounded-full">
                            {percentage.toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
        {questions.length === 0 && (
          <div className="text-center text-gray-500">No questions yet</div>
        )}
      </div>
    </div>
  );
};

export default QuestionStatisticTab;
