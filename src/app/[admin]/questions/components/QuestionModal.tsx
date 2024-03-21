import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
// Components
import {
  Button,
  Divider,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  Textarea,
  Avatar,
} from "@nextui-org/react";
import { useForm } from "react-hook-form";
// Schemas
import { questionData, questionSchema } from "../schemas";
// Enums
import { QuestionLevel, QuestionType } from "@/app/common/enums/Question";
// Stores
import useQuestionStore from "../store";
import answerRepo from "../../answers/repositories/answerRepo";
// Types
import { IQuestion, IAnswer } from "@/app/common/types";

interface Props {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  question?: IQuestion;
}

const QUESTION_TYPES: { value: QuestionType; label: string }[] = [
  { value: QuestionType.INPUT, label: "Resposta" },
  { value: QuestionType.MULTIPLE, label: "Múltipla" },
  { value: QuestionType.SELECT, label: "Selecionar" },
  { value: QuestionType.VOICE, label: "Voz" },
];

const QUESTION_LEVELS: { value: QuestionLevel; label: string }[] = [
  { value: QuestionLevel.EASY, label: `Fácil (${QuestionLevel.EASY} pontos)` },
  {
    value: QuestionLevel.MEDIUM,
    label: `Média (${QuestionLevel.MEDIUM} pontos)`,
  },
  {
    value: QuestionLevel.HARD,
    label: `Difícil (${QuestionLevel.HARD} pontos)`,
  },
];

const QuestionModal = ({ isOpen, onOpenChange, question }: Props) => {
  const modalTitle = question ? "Editar questão" : "Cadastrar questão";
  const buttonLabel = question ? "Atualizar questão" : "Cadastrar";
  const defaultDescription = question ? question.description : "";
  const defaultLevel = question ? question.level : "";
  const defaultTypeKey = question ? question.type : "";
  const defaultCorrectAnswers = question ? question.correctAnswers : "";
  const defaultWrongAnswers = question ? question.wrongAnswers : "";

  const [answers, setAnswers] = useState<IAnswer[]>([]);
  const [correctAnswers, setCorrectAnswers] = useState<IAnswer[] | any>(
    defaultCorrectAnswers
  );
  const [wrongAnswers, setWrongAnswers] = useState<IAnswer[] | any>(
    defaultWrongAnswers
  );
  const [isCorrectAnswersValid, setIsCorrectAnswersValid] =
    useState<boolean>(true);
  const [isWrongAnswersValid, setIsWrongAnswersValid] = useState<boolean>(true);

  const {
    createQuestion,
    isCreatingQuestion,
    updateQuestionByUid,
    isUpdatingQuestion,
    getAllQuestions,
  } = useQuestionStore();

  const { getAnswers } = answerRepo;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid, isSubmitting },
  } = useForm<questionData>({
    resolver: zodResolver(questionSchema),
    mode: "onBlur",
  });

  const answersValidation = () => {
    if (correctAnswers.length > 0) {
      setIsCorrectAnswersValid(true);
    } else {
      setIsCorrectAnswersValid(false);
      return false;
    }

    if (wrongAnswers.length > 0) {
      setIsWrongAnswersValid(true);
    } else {
      setIsWrongAnswersValid(false);
      return false;
    }

    return true;
  };

  const handleUploadData = async (data: Partial<IQuestion>) => {
    const isValidAnswers = answersValidation();
    if (isValidAnswers) {
      data.correctAnswers = correctAnswers;
      data.wrongAnswers = wrongAnswers;
    } else {
      return;
    }

    try {
      if (question) {
        data.uid = question.uid;
        data.img = question.img;
        if (question.uid) await updateQuestionByUid(question.uid, data);
      } else {
        await createQuestion(data);
      }
    } catch (error) {
      console.log("Error when tried to upload question data: ", error);
    } finally {
      await getAllQuestions();
      reset();
      onOpenChange(false);
    }
  };

  const getInitialData = async () => {
    const [answers] = await Promise.all([getAnswers()]);
    if (answers) setAnswers(answers);
  };

  useEffect(() => {
    getInitialData();
  }, []);

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} onClose={() => reset()}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              {modalTitle}
            </ModalHeader>
            <Divider />
            <ModalBody>
              <form
                onSubmit={handleSubmit(handleUploadData)}
                className="flex flex-col gap-2"
              >
                <Textarea
                  required
                  placeholder="Insira a descrição da pergunta"
                  type="text"
                  defaultValue={defaultDescription}
                  errorMessage={
                    errors.description && errors.description.message
                  }
                  {...register("description", { required: true })}
                />

                <Select
                  required
                  label="Selecione o nível da questão"
                  items={QUESTION_LEVELS}
                  defaultSelectedKeys={Array(defaultLevel)}
                  errorMessage={errors.level && errors.level.message}
                  {...register("level", { required: true })}
                >
                  {(questionLevel) => (
                    <SelectItem
                      key={questionLevel.value}
                      value={questionLevel.value}
                    >
                      {questionLevel.label}
                    </SelectItem>
                  )}
                </Select>

                <Select
                  required
                  label="Selecione o tipo da questão"
                  items={QUESTION_TYPES}
                  defaultSelectedKeys={Array(defaultTypeKey)}
                  errorMessage={errors.type && errors.type.message}
                  {...register("type", { required: true })}
                >
                  {(questionType) => (
                    <SelectItem
                      key={questionType.value}
                      value={questionType.value}
                    >
                      {questionType.label}
                    </SelectItem>
                  )}
                </Select>

                <Select
                  required
                  isLoading={!answers}
                  isDisabled={!answers}
                  selectionMode="multiple"
                  items={answers}
                  label="Defina as respostas corretas"
                  defaultSelectedKeys={defaultCorrectAnswers}
                  disabledKeys={wrongAnswers}
                  isInvalid={!isCorrectAnswersValid}
                  errorMessage={
                    correctAnswers.length > 0 && isCorrectAnswersValid
                      ? ""
                      : "Ao menos uma resposta correta deve ser definida"
                  }
                  onSelectionChange={(values: any) => {
                    setCorrectAnswers(Array.from(values));
                  }}
                >
                  {(answer) => (
                    <SelectItem key={answer.uid} textValue={answer.title}>
                      <div className="flex gap-2 items-center">
                        <Avatar
                          alt={answer.title}
                          className="flex-shrink-0"
                          size="sm"
                          src={answer.img}
                        />
                        <div className="flex flex-col">
                          <span className="text-small">{answer.title}</span>
                          <span className="text-tiny text-default-400 text-ellipsis">
                            {answer.description}
                          </span>
                        </div>
                      </div>
                    </SelectItem>
                  )}
                </Select>

                <Select
                  required
                  isLoading={!answers}
                  isDisabled={!answers}
                  selectionMode="multiple"
                  items={answers}
                  label="Defina as respostas erradas"
                  defaultSelectedKeys={defaultWrongAnswers}
                  disabledKeys={correctAnswers}
                  isInvalid={!isWrongAnswersValid}
                  errorMessage={
                    wrongAnswers.length > 0 && isWrongAnswersValid
                      ? ""
                      : "Ao menos uma resposta errada deve ser definida"
                  }
                  onSelectionChange={(values: any) => {
                    setWrongAnswers(Array.from(values));
                  }}
                >
                  {(answer) => (
                    <SelectItem key={answer.uid} textValue={answer.title}>
                      <div className="flex gap-2 items-center">
                        <Avatar
                          alt={answer.title}
                          className="flex-shrink-0"
                          size="sm"
                          src={answer.img}
                        />
                        <div className="flex flex-col">
                          <span className="text-small">{answer.title}</span>
                          <span className="text-tiny text-default-400 text-ellipsis">
                            {answer.description}
                          </span>
                        </div>
                      </div>
                    </SelectItem>
                  )}
                </Select>
              </form>
            </ModalBody>
            <Divider />
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Fechar
              </Button>
              <Button
                className="bg-green"
                onPress={async () => {
                  await handleSubmit(handleUploadData)();
                }}
                isLoading={isCreatingQuestion || isUpdatingQuestion}
              >
                {buttonLabel}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default QuestionModal;
