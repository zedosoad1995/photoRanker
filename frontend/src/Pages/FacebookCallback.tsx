import { HOME, LOGIN } from "@/Constants/routes";
import { useAuth } from "@/Contexts/auth";
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function FacebookCallback() {
  const { loginFacebook } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const code = searchParams.get("code");

  useEffect(() => {
    const func = async () => {
      if (code) {
        loginFacebook(code)
          .then(() => {
            navigate(HOME);
          })
          .catch(() => {
            navigate(LOGIN);
          });
      }
    };

    func();
  }, [code]);

  return <div>Redirecting back to the app...</div>;
}
