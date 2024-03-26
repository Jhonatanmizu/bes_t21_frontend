import { Button } from "@nextui-org/react";
import Link from "next/link";
import { ADMIN_ROUTES } from "@/app/common/components/Navbar/routes";
import {
  AnswerIcon,
  CourseIcon,
  LevelIcon,
  SessionIcon,
  QuestionIcon,
} from "@/app/common/icons/";

type IconMap = {
  [key: string]: React.ElementType;
};

const iconMap: IconMap = {
  AnswerIcon: AnswerIcon,
  CourseIcon: CourseIcon,
  LevelIcon: LevelIcon,
  SessionIcon: SessionIcon,
  QuestionIcon: QuestionIcon,
};

const Admin = () => {
  return (
    <main className="flex flex-wrap w-full h-full gap-2 justify-around md:justify-normal">
      {ADMIN_ROUTES.map((adm, idx) => {
        const IconComponent = adm.icon && iconMap[adm.icon];
        return (
          <Button
            key={idx}
            as={Link}
            href={adm.href}
            className="w-[50%] md:w-[30%] h-24 bg-secondary text-white font-bold hover:scale-[105%]"
            startContent={IconComponent ? <IconComponent /> : null}
          >
            {adm.title}
          </Button>
        );
      })}
    </main>
  );
};

export default Admin;
