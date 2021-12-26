import Navbar from "@/components/Navbar";
import React from "react";

const DefaultLayout = ({ children }) => {
  return (
    <>
      <Navbar />
      <main>{children}</main>
    </>
  );
};

export default DefaultLayout;
