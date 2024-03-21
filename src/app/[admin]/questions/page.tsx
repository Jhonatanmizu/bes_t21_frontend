"use client";
import { ChangeEvent, useEffect, useMemo, useState } from "react";
// Stores
import useQuestionStore from "./store";
// Components
import { Button, Input, Spinner, useDisclosure } from "@nextui-org/react";
import QuestionCard from "./components/QuestionCard";
import QuestionModal from "./components/QuestionModal";
import { AddIcon } from "@/app/common/icons";

const Questions = () => {
  const [searchText, setSearchText] = useState("");
  const { questions, isLoadingQuestions, getAllQuestions } = useQuestionStore();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const filteredQuestions = questions.filter((question) =>
    question.description
      .toLowerCase()
      .trim()
      .includes(searchText.toLowerCase().trim())
  );

  const toggleModalOpen = () => {
    onOpen();
  };

  const handleChangeSearchText = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchText(value);
  };

  useEffect(() => {
    getAllQuestions();
  }, []);

  return (
    <main className="flex-1">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-3xl mb-4">Questões</h1>
        <Button
          onClick={toggleModalOpen}
          startContent={<AddIcon />}
          className="w-auto bg-secondary text-white"
        >
          Criar nova questão
        </Button>
      </div>
      <Input
        placeholder="Pesquisar questão"
        name="search"
        value={searchText}
        autoComplete=""
        type="text"
        aria-autocomplete="none"
        onChange={handleChangeSearchText}
        className="mb-2"
      />
      <section className="flex flex-col mt-4 gap-4 flex-1 min-h-[70vh] items-center">
        {isLoadingQuestions ? (
          <Spinner label="Carregando..." color="primary" />
        ) : filteredQuestions.length > 0 ? (
          filteredQuestions.map((question, idx) => (
            <QuestionCard question={question} key={idx} />
          ))
        ) : (
          <h1>Não há dados para serem exibidos ...</h1>
        )}
      </section>
      {isLoadingQuestions && (
        <div className="flex-1 flex p-8 items-center justify-center">
          <Spinner size="lg" />
        </div>
      )}
      {isOpen && <QuestionModal isOpen={isOpen} onOpenChange={onOpenChange} />}
    </main>
  );
};

export default Questions;
