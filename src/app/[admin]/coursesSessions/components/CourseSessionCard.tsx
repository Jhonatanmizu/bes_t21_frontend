"use client";
// Types
import { ICourse } from "@/app/common/types";
// Components
import {
  Button,
  Card,
  CardBody,
  Image,
  useDisclosure,
} from "@nextui-org/react";
import UpdateCourseSessionModal from "./UpdateCourseSessionModal";
// Stores
import { useCourseSessionStore } from "../store/";
// Icons
import { RemoveIcon, EditIcon } from "@/app/common/icons";

interface Props {
  course: ICourse;
}

const CourseSessionCard = ({ course }: Props) => {
  const { deleteCourseSession, isDeletingSession, fetchAll } =
    useCourseSessionStore();
  const { description, img, uid, title } = course;
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const handleDelete = async () => {
    if (!uid) return;
    await deleteCourseSession(uid);
    await fetchAll();
  };

  return (
    <>
      <Card className="w-full hover:ring-1 hover:scale-[101%]">
        <CardBody className="flex flex-row items-center justify-between">
          <div className="items-center flex gap-8">
            <Image className="w-20 h-16" alt={description} src={img} />
            <h4>{title}</h4>
          </div>
          <div className="flex items-center gap-2">
            <Button
              className="bg-green text-white"
              onClick={onOpen}
              isLoading={isDeletingSession}
              startContent={<EditIcon />}
            >
              Atualizar
            </Button>
            <Button
              className="bg-red text-white"
              onClick={handleDelete}
              isLoading={isDeletingSession}
              startContent={<RemoveIcon />}
            >
              Deletar
            </Button>
          </div>
        </CardBody>
      </Card>
      <UpdateCourseSessionModal
        isOpen={isOpen}
        onOpen={onOpen}
        onOpenChange={onOpenChange}
        fetchAll={fetchAll}
        course={course}
      />
    </>
  );
};

export default CourseSessionCard;
