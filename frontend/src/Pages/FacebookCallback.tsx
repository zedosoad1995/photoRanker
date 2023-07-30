import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

export default function FacebookCallback() {
  const [searchParams] = useSearchParams();
  const code = searchParams.get("code");

  useEffect(() => {}, [code]);

  return <div>Redirecting back to the app...</div>;
}
