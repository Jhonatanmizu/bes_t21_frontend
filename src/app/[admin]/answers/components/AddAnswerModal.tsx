"use client";

import { useForm } from "react-hook-form";

//Zod
import { zodResolver } from "@hookform/resolvers/zod";

//Components
import ImagePicker from "../../../common/components/ImagePicker";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Divider,
  Input,
} from "@nextui-org/react";

// Schemas
import { AnswerData, answerSchema } from "../schema";

// Stores
import { useAnswerStore } from "../store/";

interface Props {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  fetchAll: () => void;
}

const AddAnswerModal = ({ isOpen, onOpenChange, fetchAll }: Props) => {
  const { storeAnswer, isLoadingNewAnswer } = useAnswerStore();
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    reset,
    formState: { errors, isValid, isSubmitting },
  } = useForm<AnswerData>({
    resolver: zodResolver(answerSchema),
  });

  const handleCreateAnswer = async (data: AnswerData) => {
    try {
      await storeAnswer(data);
      await fetchAll();
      reset();
    } catch (error) {
      console.error("Error when we tried to create a new answer", error);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      placement="top-center"
      backdrop="blur"
      onClose={() => reset()}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Cadastrar uma resposta
            </ModalHeader>
            <Divider />
            <ModalBody>
              <form
                className="flex flex-col gap-2"
                onSubmit={handleSubmit(handleCreateAnswer)}
              >
                <ImagePicker setValue={setValue} />
                <Input
                  placeholder="Insira o titulo"
                  label="Titulo"
                  type="text"
                  labelPlacement="outside"
                  errorMessage={errors.title && errors.title.message}
                  {...register("title", { required: true })}
                />
                <Input
                  placeholder="Insira uma descrição"
                  label="Descrição"
                  type="text"
                  labelPlacement="outside"
                  required
                  errorMessage={
                    errors.description && errors.description.message
                  }
                  {...register("description", { required: true })}
                />
              </form>
            </ModalBody>
            <Divider />
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Fechar
              </Button>
              <Button
                isLoading={isLoadingNewAnswer}
                className="bg-green"
                type="button"
                onClick={async () => {
                  await handleSubmit(handleCreateAnswer)().then(() => {
                    if (isValid) {
                      onClose();
                    }
                  });
                }}
              >
                Cadastrar
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default AddAnswerModal;
