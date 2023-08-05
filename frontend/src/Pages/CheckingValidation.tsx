import { EXPIRED_VALIDATION, HOME } from "@/Constants/routes";
import { useAuth } from "@/Contexts/auth";
import { verifyEmail } from "@/Services/auth";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function CheckingValidation() {
  let { token } = useParams();
  let navigate = useNavigate();
  const { updateUser } = useAuth();

  useEffect(() => {
    if (token) {
      verifyEmail(token)
        .then(async () => {
          await updateUser();
          navigate(HOME);
        })
        .catch(() => {
          navigate(EXPIRED_VALIDATION);
        });
    } else {
      navigate(EXPIRED_VALIDATION);
    }
  }, []);

  return <div className="p-4 md:p-12 mx-auto">Verifying email...</div>;
}
