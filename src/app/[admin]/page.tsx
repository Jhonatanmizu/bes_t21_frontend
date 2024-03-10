import { Button } from "@nextui-org/react";
import Link from "next/link";

interface RouteWithLink {
  title: string;
  href: string;
}

const ADMIN_ROUTES: RouteWithLink[] = [
  {
    title: "Cadastro de respostas",
    href: "/admin/answers",
  },
  {
    title: "Cadastro de cursos",
    href: "/admin/courses",
  },
  {
    title: "Cadastro de níveis",
    href: "/admin/levels",
  },
  {
    title: "Cadastro de sessões",
    href: "/admin/coursesSessions",
  },
  {
    title: "Cadastro de questões",
    href: "/admin/questions",
  },
];

const Admin = () => {
  return (
    <main className="gap-2 flex flex-col">
      {ADMIN_ROUTES.map((adm, idx) => (
        <Button
          key={idx}
          as={Link}
          href={adm.href}
          className="w-full bg-secondary text-white font-bold"
        >
          {adm.title}
        </Button>
      ))}
    </main>
  );
};

export default Admin;
