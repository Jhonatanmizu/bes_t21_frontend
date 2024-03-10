import { useMemo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
// Components
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  Textarea,
} from "@nextui-org/react";
import { useForm } from "react-hook-form";
// Schemas
import { questionData, questionSchema } from "../schemas";
// Enums
import { QuestionLevel, QuestionType } from "@/app/common/enums/Question";
// Stores
import useQuestionStore from "../store";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  questionId?: string;
}

const QUESTION_TYPES: { value: QuestionType; label: string }[] = [
  { value: QuestionType.INPUT, label: "Resposta" },
  { value: QuestionType.MULTIPLE, label: "Múltipla" },
  { value: QuestionType.SELECT, label: "Selecionar" },
];

const QUESTION_LEVELS: { value: QuestionLevel; label: string }[] = [
  { value: QuestionLevel.EASY, label: "Fácil" },
  { value: QuestionLevel.MEDIUM, label: "Média" },
  { value: QuestionLevel.HARD, label: "Difícil" },
];

const QuestionModal = ({ isOpen, onClose, questionId = "" }: Props) => {
  const {
    createQuestion,
    isCreatingQuestion,
    updateQuestionByUid,
    isUpdatingQuestion,
    getAllQuestions,
  } = useQuestionStore();
  const isEditing = !!questionId;
  const modalTitle = isEditing ? "Editar questão" : "Criar questão";
  const isLoading = useMemo(
    () => isCreatingQuestion || isUpdatingQuestion,
    [isCreatingQuestion, isUpdatingQuestion]
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<questionData>({
    resolver: zodResolver(questionSchema),
  });

  const onSubmit = async (data: questionData) => {
    if (isEditing) {
      await updateQuestionByUid(questionId, data);
    } else {
      await createQuestion(data);
    }
    await getAllQuestions;
    onClose();
  };

  return (
    <Modal isOpen={isOpen} size="xl" onOpenChange={onClose}>
      <ModalContent>
        {(onClose) => (
          <form onSubmit={handleSubmit(onSubmit)}>
            <ModalHeader className="flex flex-col gap-1">
              {modalTitle}
            </ModalHeader>
            <ModalBody>
              <Textarea
                placeholder="Insira a descrição da pergunta"
                label="Descrição"
                type="text"
                labelPlacement="outside"
                required
                errorMessage={errors.description && errors.description.message}
                {...register("description", { required: true })}
              />
              <Input
                placeholder="Insira a pontuação da questão"
                label="Pontuação"
                type="number"
                labelPlacement="outside"
                required
                errorMessage={errors.point && errors.point.message}
                {...register("point", { required: true })}
              />
              <Select label="Selecione o tipo da questão" size="sm">
                {QUESTION_TYPES.map((questionType) => (
                  <SelectItem
                    key={questionType.value}
                    value={questionType.value}
                  >
                    {questionType.label}
                  </SelectItem>
                ))}
              </Select>
              <Select label="Selecione o nível da questão" size="sm">
                {QUESTION_LEVELS.map((questionLevels) => (
                  <SelectItem
                    key={questionLevels.value}
                    value={questionLevels.value}
                  >
                    {questionLevels.label}
                  </SelectItem>
                ))}
              </Select>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Cancelar
              </Button>
              <Button
                color="primary"
                variant="light"
                type="submit"
                isLoading={isLoading}
                isDisabled={!isValid || isLoading}
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

export default QuestionModal;
