import { HOME, LOGIN } from "@/Constants/routes";
import { useAuth } from "@/Contexts/auth";
import axios from "axios";
import { useEffect } from "react";
import { toast } from "react-hot-toast";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  INVALID_LOGIN_METHOD_EMAIL,
  INVALID_LOGIN_METHOD_GOOGLE,
} from "@shared/constants/errorCodes";

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
          .catch((error) => {
            if (axios.isAxiosError(error)) {
              if (error.response?.data?.error === INVALID_LOGIN_METHOD_EMAIL) {
                toast.error(
                  "You registered using your email directly. Please log in with that method",
                  { id: "must-login-email" }
                );
              } else if (error.response?.data?.error === INVALID_LOGIN_METHOD_GOOGLE) {
                toast.error("You registered using google. Please log in with that method", {
                  id: "must-login-google",
                });
              }
            } else {
              toast.error("Something went wrong", { id: "error-login-facebook" });
            }

            navigate(LOGIN);
          });
      }
    };

    func();
  }, [code]);

  return <div>Redirecting back to the app...</div>;
}
