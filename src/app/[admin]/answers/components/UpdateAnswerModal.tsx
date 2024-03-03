import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

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

// Types
import { IAnswer } from "@/app/common/types";

// Stores
import { useAnswerStore } from "../store/";

//Icons
import { ImagePicker } from "@/app/common";
interface Answer {
  description: string;
  imageUrl: string;
  uid: string;
  title: string;
}

interface Props {
  isOpen: boolean;
  onOpen: () => void;
  onOpenChange: (isOpen: boolean) => void;
  fetchAll: () => void;
  answer: IAnswer;
}

const UpdateAnswerModal = ({
  isOpen,
  onOpen,
  onOpenChange,
  fetchAll,
  answer,
}: Props) => {
  const { description, imageUrl, uid, title } = answer;

  const { updateAnswer, isLoadingNewAnswer } = useAnswerStore();
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

  const handleUpdateAnswer = async (data: AnswerData) => {
    try {
      await updateAnswer(uid, data, imageUrl);
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
              Atualizar resposta
            </ModalHeader>
            <Divider />
            <ModalBody>
              <form
                className="flex flex-col gap-2"
                onSubmit={handleSubmit(handleUpdateAnswer)}
              >
                <ImagePicker setValue={setValue} imageUrl={imageUrl} />
                <Input
                  placeholder="Insira o titulo"
                  label="Titulo"
                  type="text"
                  labelPlacement="outside"
                  errorMessage={errors.title && errors.title.message}
                  {...register("title", { required: true })}
                  defaultValue={title}
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
                  defaultValue={description}
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
                  await handleSubmit(handleUpdateAnswer)().then(() => {
                    if (isValid) {
                      onOpen();
                    }
                  });
                }}
              >
                Atualizar
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default UpdateAnswerModal;
