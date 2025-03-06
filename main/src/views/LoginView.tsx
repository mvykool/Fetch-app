import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { strings } from "../constants/strings";
import LoginForm from "../components/auth/LoginForm";

const LoginView = () => {
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (name: string, email: string) => {
    if (!name.trim() || !email.trim()) {
      setError("Please enter both name and email");
      return;
    }

    setError(null);

    try {
      await login(name, email);
      navigate("/");
    } catch (err) {
      setError("Login failed. Please check your information and try again.");
      console.error(err);
      throw err;
    }
  };

  return (
    <div className="flex flex-col items-center mt-20 px-4">
      <div className="w-full max-w-md bg-white rounded-lg border border-black  p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-Coltext">
            {strings.header.logo}
          </h1>
          <p className="text-gray-600 mt-2">{strings.login.subtitle}</p>
        </div>

        <LoginForm onSubmit={handleLogin} error={error} />

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>{strings.login.text}</p>
        </div>
      </div>
    </div>
  );
};

export default LoginView;
