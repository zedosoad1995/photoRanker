"use client";

import { useAuth } from "../../contexts/auth";
import { useRouter } from "next/navigation";
import { LOGIN } from "@/constants/routes";

export default function Home() {
  const router = useRouter();
  const { user, logout } = useAuth();

  if (!user) {
    return <div>Loading...</div>;
  }

  const handleLogout = async () => {
    await logout();
    router.push(LOGIN);
  };

  return (
    <>
      <div>You did it, {user.name}!</div>
      <button onClick={handleLogout}>Logout</button>
    </>
  );
}
