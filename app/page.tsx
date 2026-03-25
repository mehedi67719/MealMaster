"use client";
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import React from 'react';

const page = () => {
  const session=useSession();
  console.log(session)
  return (
    <div>
      <Link href={"/login"}>login</Link>
    </div>
  );
};

export default page;