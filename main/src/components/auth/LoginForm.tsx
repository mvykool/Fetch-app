import { useState } from "react";
import { strings } from "../../constants/strings";

interface LoginFormProps {
  onSubmit: (name: string, email: string) => Promise<void>;
  error: string | null;
}

const LoginForm = ({ onSubmit, error }: LoginFormProps) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !email.trim()) {
      return;
    }

    setLoading(true);

    try {
      await onSubmit(name, email);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {strings.login.labelName}
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border border-black rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
            placeholder={strings.login.name}
            required
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {strings.login.labelEmail}
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-black rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
            placeholder={strings.login.email}
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-rose-400 text-white py-2 px-4 border border-black rounded-md hover:bg-rose-500 focus:outline-none focus:ring-2 focus:ring-secondary cursor-pointer focus:ring-offset-2 transition-colors disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </>
  );
};

export default LoginForm;
