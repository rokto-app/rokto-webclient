import Link from "next/link";
import React from "react";

const Navbar = () => {
  return (
    <header className="px-2 py-4">
      <div className="flex justify-between wrapper">
        <Link href="/">
          <a className="text-2xl font-medium ">Home</a>
        </Link>
        <nav className="flex justify-between gap-4">
          <Link href="/">
            <a className="text-lg uppercase ">Home</a>
          </Link>

          <Link href="/">
            <a className="text-lg uppercase ">Home</a>
          </Link>

          <Link href="/">
            <a className="text-lg uppercase ">Home</a>
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
