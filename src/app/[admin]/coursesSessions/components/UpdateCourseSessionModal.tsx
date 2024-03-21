import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
// Components
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
import { ImagePicker } from "@/app/common";
// Schemas
import { courseSessionData, courseSessionSchema } from "../schema";
// Types
import { ICourse } from "@/app/common/types";
// Stores
import { useCourseSessionStore } from "../store/";

interface Props {
  isOpen: boolean;
  onOpen: () => void;
  onOpenChange: (isOpen: boolean) => void;
  fetchAll: () => void;
  course: ICourse;
}

const UpdateCourseSessionModal = ({
  isOpen,
  onOpen,
  onOpenChange,
  fetchAll,
  course,
}: Props) => {
  const { description, img, uid, title, remotePath } = course;

  const { updateCourseSession, isLoadingNewSession } = useCourseSessionStore();
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isValid, isSubmitting },
  } = useForm<courseSessionData>({
    resolver: zodResolver(courseSessionSchema),
  });

  const handleUpdateCourseSession = async (data: courseSessionData) => {
    try {
      await updateCourseSession(uid, data);
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
              Atualizar sessão
            </ModalHeader>
            <Divider />
            <ModalBody>
              <form
                className="flex flex-col gap-2"
                onSubmit={handleSubmit(handleUpdateCourseSession)}
              >
                <Input
                  type="text"
                  labelPlacement="outside"
                  errorMessage={errors.remotePath && errors.remotePath.message}
                  {...register("remotePath", { required: true })}
                  defaultValue={remotePath}
                  className="hidden"
                />
                <ImagePicker setValue={setValue} img={img} />
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
                isLoading={isLoadingNewSession}
                className="bg-green"
                type="button"
                onClick={async () => {
                  await handleSubmit(handleUpdateCourseSession)().then(() => {
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

export default UpdateCourseSessionModal;
