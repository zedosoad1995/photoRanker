"use client";

import { useAuth } from "@/contexts/auth";

export default function Home() {
  const { user } = useAuth();

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div>You did it, {user.name}!</div>
    </>
  );
}
