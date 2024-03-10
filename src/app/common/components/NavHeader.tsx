import React from "react";
// Components
import {
  Button,
  Link,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from "@nextui-org/react";

const NavHeader = () => {
  return (
    <Navbar className="bg-primary text-white">
      <NavbarBrand>
        <p className="font-bold text-inherit">BES T21</p>
      </NavbarBrand>
      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem>
          <Link className="text-white" href="/admin">
            ADMIN
          </Link>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
};

export default NavHeader;
