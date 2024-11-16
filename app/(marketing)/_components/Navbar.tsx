"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserButton, useUser } from "@clerk/nextjs";

const Navbar = () => {
  const { user } = useUser();

  return (
    <div className="flex w-full justify-between items-center">
      <div className="text-3xl font-semibold flex items-center gap-3">
        <Image alt="logo" src="/opal-logo.svg" width={40} height={40} />

        <span>Opal</span>
      </div>

      <div className="hidden gap-10 items-center lg:flex">
        <Link
          href="/"
          className="bg-[#7320DD] py-2 px-5 font-semibold text-lg rounded-full hover:bg-[#7320DD]/80"
        >
          Home
        </Link>

        <Link href="/">Pricing</Link>

        <Link href="/">Contact</Link>
      </div>

      {user ? (
        <div className="flex items-center gap-3">
          <UserButton signInUrl="/auth/sign-in" />

          <Link href="/dashboard">
            <Button className="text-base flex gap-2" variant="secondary">
              Enter
              <ArrowRight fill="#000" />
            </Button>
          </Link>
        </div>
      ) : (
        <Link href="/auth/sign-in">
          <Button className="text-base flex gap-2">
            <User fill="#000" />
            Login
          </Button>
        </Link>
      )}
    </div>
  );
};

export default Navbar;
