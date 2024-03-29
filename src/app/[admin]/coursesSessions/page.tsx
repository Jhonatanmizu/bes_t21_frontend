"use client";
import { ChangeEvent, useEffect, useMemo, useState } from "react";
// Stores
import { useCourseSessionStore } from "./store";
// Components
import { Button, Input, Spinner, useDisclosure } from "@nextui-org/react";
import CourseSessionCard from "./components/CourseSessionCard";
import AddCourseSessionModal from "./components/AddCourseSessionModal";
// Icons
import { AddIcon, SearchIcon } from "../../common/icons";

const CoursesSessions = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [searchText, setSearchText] = useState("");
  const { courses, fetchAll, isLoading } = useCourseSessionStore();

  useEffect(() => {
    fetchAll();
  }, []);

  const filteredCoursesSessions = courses.filter((course) =>
    course.title.toLowerCase().trim().includes(searchText.toLowerCase().trim())
  );

  const handleChangeSearchText = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value);
  };

  return (
    <main className="flex-1">
      <section className="flex justify-between">
        <h1 className="text-3xl mb-4">Sessões de cursos</h1>
        <Button
          startContent={<AddIcon />}
          className="w-auto bg-secondary text-white"
          onPress={onOpen}
        >
          Adicionar
        </Button>
      </section>
      <Input
        variant="bordered"
        placeholder="Pesquisar sessão"
        name="search"
        value={searchText}
        autoComplete=""
        type="text"
        aria-autocomplete="none"
        onChange={handleChangeSearchText}
        endContent={<SearchIcon />}
      />
      <section className="flex flex-col mt-4 gap-4 flex-1 min-h-[70vh] items-center">
        {isLoading ? (
          <Spinner label="Carregando..." color="primary" />
        ) : filteredCoursesSessions.length > 0 ? (
          filteredCoursesSessions.map((course, idx) => (
            <CourseSessionCard course={course} key={idx} />
          ))
        ) : (
          <h1>Não há dados para serem exibidos ...</h1>
        )}
      </section>
      <AddCourseSessionModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        fetchAll={fetchAll}
      />
    </main>
  );
};

export default CoursesSessions;
