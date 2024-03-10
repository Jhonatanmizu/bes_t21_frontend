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
import { createLevelData, createLevelSchema } from "../schemas";

interface Props {
  isOpen: boolean;
  onOpen: () => void;
  onOpenChange: (isOpen: boolean) => void;
}

const CreateLevelModal = ({ isOpen, onOpen, onOpenChange }: Props) => {
  const { storeLevel, isLoadingNewLevel, fetchAll } = useLevelStore();
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<createLevelData>({
    resolver: zodResolver(createLevelSchema),
  });

  const onSubmit = async (data: createLevelData) => {
    try {
      await storeLevel(data);
      await fetchAll();
    } catch (error) {
      console.error(
        "Error when we tried to create a leve in new level page",
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
            <ModalHeader>Criar ranking</ModalHeader>
            <Divider />
            <ModalBody className="flex flex-col gap-2">
              <ImagePicker setValue={setValue} />
              <Input
                type="text"
                labelPlacement="outside"
                className="hidden"
                errorMessage={errors.remotePath && errors.remotePath.message}
                {...register("remotePath", { required: true })}
              />
              <Input
                placeholder="Insira o nome do ranking"
                label="Nome"
                type="text"
                labelPlacement="outside"
                required
                errorMessage={errors.title && errors.title.message}
                {...register("title", { required: true })}
              />
              <Input
                placeholder="Inicia-se em"
                label="Intervalo de ínicio"
                type="number"
                labelPlacement="outside"
                required
                errorMessage={errors.startIn && errors.startIn.message}
                {...register("startIn", { required: true })}
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
              />
              <Input
                placeholder="Descreva aqui o ranking"
                label="Descrição"
                type="text"
                labelPlacement="outside"
                {...register("description")}
              />
            </ModalBody>
            <Divider />
            <ModalFooter>
              <Button color="danger" variant="light" onClick={onClose}>
                Fechar
              </Button>
              <Button
                isLoading={isLoadingNewLevel}
                className="bg-green"
                type="submit"
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

export default CreateLevelModal;
