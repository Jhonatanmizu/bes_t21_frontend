"use client";
// Types
import { IAnswer } from "@/app/common/types";
// Components
import {
  Button,
  Card,
  CardBody,
  Image,
  useDisclosure,
} from "@nextui-org/react";
import UpdateAnswerModal from "./UpdateAnswerModal";
// Stores
import { useAnswerStore } from "../store";
// Icons
import { RemoveIcon, EditIcon } from "@/app/common/icons";

interface Props {
  answer: IAnswer;
}

const AnswerCard = ({ answer }: Props) => {
  const { deleteAnswer, isDeletingAnswer, fetchAll } = useAnswerStore();
  const { description, img, uid, title } = answer;
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const handleDelete = async () => {
    if (!uid) return;
    await deleteAnswer(uid);
    await fetchAll();
  };

  return (
    <>
      <Card className="w-full hover:ring-1 hover:scale-[101%]">
        <CardBody className="flex flex-row items-center justify-between">
          <div className="items-center flex gap-8">
            <Image className="w-20 h-16" alt={description} src={img} />
            <h4>{title}</h4>
          </div>
          <div className="flex items-center gap-2">
            <Button
              className="bg-green text-white"
              onClick={onOpen}
              isLoading={isDeletingAnswer}
              startContent={<EditIcon />}
            >
              Atualizar
            </Button>
            <Button
              className="bg-red text-white"
              onClick={handleDelete}
              isLoading={isDeletingAnswer}
              startContent={<RemoveIcon />}
            >
              Deletar
            </Button>
          </div>
        </CardBody>
      </Card>
      <UpdateAnswerModal
        isOpen={isOpen}
        onOpen={onOpen}
        onOpenChange={onOpenChange}
        fetchAll={fetchAll}
        answer={answer}
      />
    </>
  );
};

export default AnswerCard;
