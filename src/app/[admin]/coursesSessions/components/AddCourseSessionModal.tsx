"use client";
import { useForm } from "react-hook-form";
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
import { courseSessionData, courseSessionSchema } from "../schema";
// Stores
import { useCourseSessionStore } from "../store/";

interface Props {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  fetchAll: () => void;
}

const AddCourseSessionModal = ({ isOpen, onOpenChange, fetchAll }: Props) => {
  const { storeCourseSession, isLoadingNewSession } = useCourseSessionStore();
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    reset,
    formState: { errors, isValid, isSubmitting },
  } = useForm<courseSessionData>({
    resolver: zodResolver(courseSessionSchema),
  });

  const handleCreateCourseSession = async (data: courseSessionData) => {
    try {
      await storeCourseSession(data);
      await fetchAll();
      reset();
    } catch (error) {
      console.error(
        "Error when we tried to create a new course session",
        error
      );
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
              Cadastrar uma sessão
            </ModalHeader>
            <Divider />
            <ModalBody>
              <form
                className="flex flex-col gap-2"
                onSubmit={handleSubmit(handleCreateCourseSession)}
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
                isLoading={isLoadingNewSession}
                className="bg-green"
                type="button"
                onClick={async () => {
                  await handleSubmit(handleCreateCourseSession)().then(() => {
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

export default AddCourseSessionModal;
