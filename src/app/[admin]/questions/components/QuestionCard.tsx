import React from "react";
import useQuestionStore from "../store";
// Types
import { IQuestion } from "@/app/common/types";
import { Button, Card, CardBody } from "@nextui-org/react";
import Image from "next/image";

interface Props {
  question: IQuestion;
}

const QuestionCard = ({ question }: Props) => {
  const { uid, description, img } = question;
  const { deleteQuestionByUid } = useQuestionStore();

  const handleDeleteQuestion = () => {
    if (!uid) return;
    deleteQuestionByUid(uid);
  };

  return (
    <Card>
      <CardBody>
        <div className="flex flex-row items-center justify-between">
          <div className="items-center flex gap-8">
            <Image
              src={question.img}
              alt="question cover"
              className="w-20 h-16"
            />
            <h4>{description}</h4>
          </div>
          <div className="flex items-center gap-2">
            <Button
              className="bg-red text-white"
              onClick={handleDeleteQuestion}
            >
              Deletar
            </Button>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default QuestionCard;
