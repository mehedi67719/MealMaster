"use client";

import { SessionProvider } from "next-auth/react";
import React, { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

const NextAuthProvider = ({ children }: Props) => {
  return <SessionProvider>{children}</SessionProvider>;
};

export default NextAuthProvider;