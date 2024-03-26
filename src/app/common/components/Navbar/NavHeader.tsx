"use client";
import React, { useState } from "react";
import { usePathname } from "next/navigation";

// Components
import {
  Button,
  Link,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
  Tooltip,
} from "@nextui-org/react";

// Routes
import { ADMIN_ROUTES } from "@/app/common/components/Navbar/routes";

// Icons
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

const NavHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const clearPathName = usePathname();

  return (
    <Navbar
      shouldHideOnScroll
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
      className="bg-primary text-white"
    >
      <NavbarContent justify="start">
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        />
        <NavbarBrand>
          <p className="font-bold text-inherit">BES T21</p>
        </NavbarBrand>
      </NavbarContent>
      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        {ADMIN_ROUTES.map((adm, idx) => {
          const IconComponent = adm.icon && iconMap[adm.icon];

          return (
            <Tooltip key={idx} content={adm.title}>
              <Button
                isIconOnly
                variant={clearPathName === adm.href ? "faded" : "flat"}
                as={Link}
                href={adm.href}
                className="w-[50%] md:w-[30%] text-white bg-secondary font-bold hover:scale-[105%] hover:border-1 transition-all"
              >
                {IconComponent ? <IconComponent /> : null}
              </Button>
            </Tooltip>
          );
        })}
      </NavbarContent>
      <NavbarContent className="hidden sm:flex gap-4" justify="end">
        <NavbarItem>
          <Link className="text-white" href="/admin">
            ADMIN
          </Link>
        </NavbarItem>
      </NavbarContent>

      <NavbarMenu>
        {ADMIN_ROUTES.map((adm, idx) => (
          <NavbarMenuItem key={idx}>
            <Button
              as={Link}
              color="primary"
              variant={clearPathName === adm.href ? "bordered" : "light"}
              href={adm.href}
              className="text-black hover:ring-1 transition-all"
            >
              {adm.title}
            </Button>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
};

export default NavHeader;
