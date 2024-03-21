import React from "react";
import useQuestionStore from "../store";
// Types
import { IQuestion } from "@/app/common/types";
import { Button, Card, CardBody, useDisclosure } from "@nextui-org/react";
import Image from "next/image";
import { EditIcon, RemoveIcon } from "@/app/common/icons";
import QuestionModal from "./QuestionModal";

interface Props {
  question: IQuestion;
}

const QuestionCard = ({ question }: Props) => {
  const { uid, description, img } = question;
  const { deleteQuestionByUid, getAllQuestions } = useQuestionStore();
  const { isOpen, onOpenChange } = useDisclosure();

  const handleDeleteQuestion = async () => {
    if (!uid) return;
    await deleteQuestionByUid(uid);
    await getAllQuestions();
  };

  return (
    <>
      <Card className="w-full hover:ring-1 hover:scale-[101%]">
        <CardBody>
          <div className="flex flex-row items-center justify-between">
            <div className="items-center flex gap-8">
              {img && (
                <Image src={img} alt="question cover" className="w-20 h-16" />
              )}
              <h4>{description}</h4>
            </div>
            <div className="flex items-center gap-2">
              <Button
                className="bg-green text-white"
                onClick={() => onOpenChange()}
                startContent={<EditIcon />}
              >
                Atualizar
              </Button>
              <Button
                className="bg-red text-white"
                onClick={handleDeleteQuestion}
                startContent={<RemoveIcon />}
              >
                Deletar
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>
      {isOpen && (
        <QuestionModal
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          question={question}
        />
      )}
    </>
  );
};

export default QuestionCard;
