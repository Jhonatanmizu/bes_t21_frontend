interface RouteWithLink {
  title: string;
  href: string;
  icon?: string;
}

export const ADMIN_ROUTES: RouteWithLink[] = [
  {
    title: "Gerência de respostas",
    href: "/admin/answers",
    icon: "AnswerIcon",
  },
  {
    title: "Gerência de cursos",
    href: "/admin/courses",
    icon: "CourseIcon",
  },
  {
    title: "Gerência de níveis",
    href: "/admin/levels",
    icon: "LevelIcon",
  },
  {
    title: "Gerência de sessões",
    href: "/admin/coursesSessions",
    icon: "SessionIcon",
  },
  {
    title: "Gerência de questões",
    href: "/admin/questions",
    icon: "QuestionIcon",
  },
];
