"use client";

import ControllerDashboard from "@/Components/controllerdashboard/controllerdashboard";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const Page = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);


  if (status === "loading") {
    return <p>Loading...</p>;
  }

 
  if (!session?.user) return null;

  return (
    <div>
     <ControllerDashboard/>
    </div>
  );
};

export default Page;