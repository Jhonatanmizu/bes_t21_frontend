"use client";
import { useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useMemo, useState } from "react";
// Stores
import useQuestionStore from "./store";
// Components
import { Input, Spinner } from "@nextui-org/react";

const Questions = () => {
  const router = useRouter();
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
      <h1 className="text-3xl mb-4">Questões</h1>
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
    </main>
  );
};

export default Questions;
