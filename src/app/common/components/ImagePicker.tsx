"use client";
import NextImage from "next/image";
import { ChangeEvent, useEffect, useRef, useState } from "react";

// Icons
import { AddFileSvg } from "../icons";

// Components
import { Button, Image } from "@nextui-org/react";
import { UseFormSetValue } from "react-hook-form";

interface Props {
  setValue: UseFormSetValue<
    | {
        img?: any;
      }
    | any
  >;
  img?: string;
}

const ImagePicker = ({ setValue, img }: Props) => {
  const [selectedImage, setSelectedImage] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleFileInput = () => {
    if (!fileInputRef?.current || !fileInputRef?.current.click) return;
    fileInputRef?.current?.click();
  };

  const onImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = !!e.target.files ? e.target.files[0] : null;
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (loadEvent) => {
      if (loadEvent.target?.result) {
        setSelectedImage(loadEvent.target?.result as string);
        setValue("img", file);
      }
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    if (img) {
      setSelectedImage(img);
      setValue("img", img);
    }
  }, [img]);

  return (
    <div className="flex w-full h-full">
      <input
        type="file"
        accept="image/*"
        className="hidden"
        multiple={false}
        ref={fileInputRef}
        onChange={onImageChange}
      />
      {selectedImage ? (
        <Image
          as={NextImage}
          src={selectedImage}
          loading="lazy"
          alt="Imagem selecionada"
          width={400}
          height={200}
          className="rounded-xl min-w-full bg-primary h-56 cursor-pointer self-center"
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
    </div>
  );
};

export default ImagePicker;
