import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ChangeEvent, useRef, useState } from "react";
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
import Image from "next/image";

// Schemas
import { AnswerData, answerSchema } from "../schema";

// Stores
import { useAnswerStore } from "../store/";

//Icons
import { AddFileSvg } from "../../../common/icons";

const UpdateAnswerModal = ({ ...props }) => {
  const { isOpen, onOpen, onOpenChange, fetchAll, answer } = props;
  const { description, imageUrl, uid, statement } = answer;

  const [selectedImage, setSelectedImage] = useState<string>("");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { updateAnswer, isLoadingNewAnswer } = useAnswerStore();
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors, isValid, isSubmitting },
  } = useForm<AnswerData>({
    resolver: zodResolver(answerSchema),
  });

  const handleUpdateAnswer = async (data: AnswerData) => {
    try {
      await updateAnswer(uid, data, imageUrl);
      await fetchAll();
    } catch (error) {
      console.error("Error when we tried to create a new answer", error);
    }
  };

  const onImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = !!e.target.files ? e.target.files[0] : null;
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (loadEvent) => {
      if (loadEvent.target?.result) {
        setSelectedImage(loadEvent.target?.result as string);
        setValue("imageUrl", file);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileInput = () => {
    if (!fileInputRef?.current || !fileInputRef?.current.click) return;
    fileInputRef?.current?.click();
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      placement="top-center"
      backdrop="blur"
      onClose={() => setSelectedImage("")}
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
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  multiple={false}
                  ref={fileInputRef}
                  onChange={onImageChange}
                />
                {imageUrl || selectedImage ? (
                  <Image
                    src={selectedImage || imageUrl}
                    alt="Imagem selecionada"
                    width={200}
                    height={400}
                    className="rounded-xl min-w-full bg-primary h-56 cursor-pointer"
                    onClick={handleFileInput}
                  />
                ) : (
                  <Button
                    isIconOnly
                    aria-label="Selecione uma imagem"
                    className="rounded-xl min-w-full bg-primary h-56 cursor-pointer"
                    onClick={handleFileInput}
                  >
                    <AddFileSvg />
                  </Button>
                )}
                <Input
                  placeholder="Insira o titulo"
                  label="Titulo"
                  type="text"
                  labelPlacement="outside"
                  errorMessage={errors.statement && errors.statement.message}
                  {...register("statement", { required: true })}
                  defaultValue={statement}
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
                    onOpen();
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
