import { HOME, LOGIN } from "@/Constants/routes";
import { FACEBOOK_CALLBACK_URI } from "@/Constants/uri";
import { useAuth } from "@/Contexts/auth";
import { loginFacebook } from "@/Services/auth";
import axios from "axios";
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
        let res = await axios.get(
          "https://graph.facebook.com/v4.0/oauth/access_token",
          {
            params: {
              client_id: import.meta.env.VITE_FACEBOOK_AUTH_ID,
              client_secret: import.meta.env.VITE_FACEBOOK_AUTH_SECRET,
              redirect_uri: FACEBOOK_CALLBACK_URI,
              code,
            },
          }
        );

        res = await axios.get("https://graph.facebook.com/me", {
          params: {
            fields: ["id", "email", "name"].join(","),
            access_token: res.data.access_token,
          },
        });

        loginFacebook(res.data)
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
