"use client";
import { ChangeEvent, useEffect, useState } from "react";
// Stories
import { useLevelStore } from "./store/levelStore";
// Components
import { Button, Input, useDisclosure } from "@nextui-org/react";
import LevelCard from "./components/LevelCard";
import { AddIcon } from "@/app/common/icons";
import CreateLevelModal from "./components/CreateLevelModal";

const Levels = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [searchText, setSearchText] = useState("");
  const { levels, fetchAll } = useLevelStore();

  useEffect(() => {
    fetchAll();
  }, []);

  const filteredLevels = levels.filter((level) =>
    level.description
      .toLowerCase()
      .trim()
      .includes(searchText.toLowerCase().trim())
  );

  const handleChangeSearchText = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchText(value);
  };

  return (
    <main className="flex-1">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl mb-4">Rankings</h1>
        <Button
          startContent={<AddIcon />}
          className="w-auto bg-secondary text-white"
          onPress={onOpen}
        >
          Adicionar
        </Button>
      </div>

      <Input
        placeholder="Pesquisar ranking"
        name="search"
        value={searchText}
        autoComplete=""
        type="text"
        aria-autocomplete="none"
        onChange={handleChangeSearchText}
      />
      <section className="flex flex-col mt-4 gap-4 flex-1 min-h-[70vh]">
        {filteredLevels.map((level, idx) => (
          <LevelCard level={level} key={idx} />
        ))}
      </section>
      <CreateLevelModal
        isOpen={isOpen}
        onOpen={onOpen}
        onOpenChange={onOpenChange}
      />
    </main>
  );
};

export default Levels;
