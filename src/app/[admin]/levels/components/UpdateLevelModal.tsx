"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLevelStore } from "../store/levelStore";
// Components
import { ImagePicker } from "@/app/common";
import {
  Button,
  Divider,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
// Schemas
import { updateLevelSchema, updateLevelData } from "../schemas";
// Types
import { ILevel } from "@/app/common/types";

interface Props {
  isOpen: boolean;
  onOpen: () => void;
  onOpenChange: (isOpen: boolean) => void;
  uid: string;
  level: ILevel;
}

const UpdateLevelModal = ({
  isOpen,
  onOpen,
  onOpenChange,
  uid,
  level,
}: Props) => {
  const { fetchAll, updateLevelByUid, isUpdatingLevel } = useLevelStore();
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<updateLevelData>({
    resolver: zodResolver(updateLevelSchema),
  });

  const onSubmit = async (data: updateLevelData) => {
    try {
      await updateLevelByUid(uid, data);
      await fetchAll();
      onOpenChange(false);
    } catch (error) {
      console.error(
        "Error when we tried to update a level in new level page",
        error
      );
    }
  };

  return (
    <Modal
      placement="top-center"
      backdrop="blur"
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      onClose={() => reset()}
    >
      <ModalContent>
        {(onClose) => (
          <form onSubmit={handleSubmit(onSubmit)}>
            <ModalHeader>Editar ranking</ModalHeader>
            <Divider />
            <ModalBody className="flex flex-col gap-2">
              <ImagePicker setValue={setValue} img={level.img} />
              <Input
                type="text"
                labelPlacement="outside"
                className="hidden"
                errorMessage={errors.remotePath && errors.remotePath.message}
                {...register("remotePath")}
                defaultValue={level.remotePath}
              />
              <Input
                placeholder="Insira o nome do ranking"
                label="Nome"
                type="text"
                validationBehavior="native"
                labelPlacement="outside"
                required
                errorMessage={errors.title && errors.title.message}
                {...register("title", { required: true })}
                defaultValue={level.title}
              />
              <Input
                placeholder="Inicia-se em"
                label="Intervalo de ínicio"
                type="number"
                labelPlacement="outside"
                required
                errorMessage={errors.startIn && errors.startIn.message}
                {...register("startIn", { required: true })}
                defaultValue={level.startIn?.toString()}
              />
              <Input
                placeholder="Insira o número entre 1 e 5"
                label="Número de estrelas"
                type="number"
                labelPlacement="outside"
                min={1}
                max={5}
                errorMessage={
                  errors.numberOfStars && errors.numberOfStars.message
                }
                {...register("numberOfStars", { required: true })}
                defaultValue={level.numberOfStars?.toString()}
              />
              <Input
                placeholder="Descreva aqui o ranking"
                label="Descrição"
                type="text"
                labelPlacement="outside"
                {...register("description")}
                defaultValue={level.description}
              />
            </ModalBody>
            <Divider />
            <ModalFooter>
              <Button
                color="danger"
                variant="light"
                onClick={onClose}
                isDisabled={isUpdatingLevel}
              >
                Fechar
              </Button>
              <Button
                className="bg-green"
                type="submit"
                isLoading={isUpdatingLevel}
              >
                Salvar
              </Button>
            </ModalFooter>
          </form>
        )}
      </ModalContent>
    </Modal>
  );
};

export default UpdateLevelModal;
