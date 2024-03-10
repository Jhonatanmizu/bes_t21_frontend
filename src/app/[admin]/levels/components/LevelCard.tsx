"use client";
import { useRouter } from "next/navigation";
// Types
import { ILevel } from "@/app/common/types";
// Components
import {
  Button,
  Card,
  CardBody,
  Image,
  useDisclosure,
} from "@nextui-org/react";
// Stories
import { useLevelStore } from "../store/levelStore";
import { EditIcon, RemoveIcon } from "@/app/common/icons";
import UpdateLevelModal from "./UpdateLevelModal";

interface Props {
  level: ILevel;
}

const LevelCard = ({ level }: Props) => {
  const { deleteLevel, isDeletingLevel, fetchAll } = useLevelStore();
  const { title, img, uid } = level;
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const handleDelete = async () => {
    if (!uid) return;
    await deleteLevel(uid);
    await fetchAll();
  };

  return (
    <>
      <Card className="w-full hover:ring-1 hover:scale-[101%]">
        <CardBody className="flex flex-row items-center justify-between">
          <div className="items-center flex gap-8">
            <Image className="w-20 h-16" alt={title} src={img} />
            <h4>{title}</h4>
          </div>
          <div className="flex items-center gap-2">
            <Button
              className="bg-green text-white"
              onClick={onOpen}
              isLoading={isDeletingLevel}
              startContent={<EditIcon />}
            >
              Atualizar
            </Button>
            <Button
              className="bg-red text-white"
              onClick={handleDelete}
              isLoading={isDeletingLevel}
              startContent={<RemoveIcon />}
            >
              Deletar
            </Button>
          </div>
        </CardBody>
      </Card>
      {isOpen && (
        <UpdateLevelModal
          isOpen={isOpen}
          onOpen={onOpen}
          uid={uid}
          onOpenChange={onOpenChange}
        />
      )}
    </>
  );
};

export default LevelCard;
