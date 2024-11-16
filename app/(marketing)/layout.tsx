import React from "react";
import Navbar from "./_components/Navbar";
import Container from "@/components/global/Container";

type Props = {
  children: React.ReactNode;
};

const Layout = ({ children }: Props) => {
  return (
    <div className="flex flex-col py-10 px-10 xl:px-0">
      <Container>
        <Navbar />

        {children}
      </Container>
    </div>
  );
};

export default Layout;
