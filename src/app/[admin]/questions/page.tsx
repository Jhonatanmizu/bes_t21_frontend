"use client";
import { useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useMemo, useState } from "react";
// Stores
import useQuestionStore from "./store";
// Components
import { Button, Input, Spinner } from "@nextui-org/react";
import QuestionCard from "./components/QuestionCard";
import QuestionModal from "./components/QuestionModal";

const Questions = () => {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const { questions, isLoadingQuestions, getAllQuestions } = useQuestionStore();

  const filteredQuestions = useMemo(
    () =>
      questions.filter((question) =>
        question.description
          .toLowerCase()
          .trim()
          .includes(searchText.toLowerCase().trim())
      ),
    [questions.length, searchText]
  );

  const toggleModalOpen = () => {
    setIsModalOpen((previousState) => !previousState);
  };

  const handleChangeSearchText = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchText(value);
  };

  const handleNavigationToNewQuestion = () => {
    router.push("/admin/questions/new");
  };

  useEffect(() => {
    getAllQuestions();
  }, []);

  return (
    <main className="flex-1">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-3xl mb-4">Questões</h1>
        <Button onClick={toggleModalOpen}>Criar nova questão</Button>
      </div>
      <Input
        placeholder="Pesquisar questão"
        name="search"
        value={searchText}
        autoComplete=""
        type="text"
        aria-autocomplete="none"
        onChange={handleChangeSearchText}
      />
      {isLoadingQuestions && (
        <div className="flex-1 flex p-8 items-center justify-center">
          <Spinner size="lg" />
        </div>
      )}
      {filteredQuestions.map((question, idx) => (
        <QuestionCard question={question} key={idx} />
      ))}
      {isModalOpen && (
        <QuestionModal isOpen={isModalOpen} onClose={toggleModalOpen} />
      )}
    </main>
  );
};

export default Questions;
