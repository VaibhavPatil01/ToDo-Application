import { useState, useContext } from "react";
import { AppContext } from "../context/AppContext";
import { Link } from "react-router-dom";

const Login = () => {
  const [state, setState] = useState("Login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { login, register } = useContext(AppContext);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      let result;
      if (state === "Login") {
        result = await login(email, password);
      } else {
        result = await register(name, email, password);
      }

      if (!result.success) {
        setError(result.error);
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">
          {state}
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Welcome back! Please sign in to continue
        </p>

        {error && (
          <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={onSubmitHandler} className="space-y-6">
          {state !== "Login" && (
            <div className="border border-gray-300 rounded-lg px-4 py-3">
              <input
                onChange={(e) => setName(e.target.value)}
                value={name}
                className="outline-none w-full text-gray-700 placeholder-gray-500"
                type="text"
                placeholder="Full Name"
                required
                disabled={loading}
              />
            </div>
          )}

          <div className="border border-gray-300 rounded-lg px-4 py-3">
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              className="outline-none w-full text-gray-700 placeholder-gray-500"
              type="email"
              placeholder="Email address"
              required
              disabled={loading}
            />
          </div>

          <div className="border border-gray-300 rounded-lg px-4 py-3">
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              className="outline-none w-full text-gray-700 placeholder-gray-500"
              type="password"
              placeholder="Password"
              required
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Processing..." : state === "Login" ? "Login" : "Create Account"}
          </button>
        </form>

        {state === "Login" ? (
          <p className="mt-6 text-center text-gray-600">
            Don't have an account?{" "}
            <button
              onClick={() => setState("Sign Up")}
              className="text-blue-600 font-semibold hover:text-blue-700"
            >
              Sign up
            </button>
          </p>
        ) : (
          <p className="mt-6 text-center text-gray-600">
            Already have an account?{" "}
            <button
              onClick={() => setState("Login")}
              className="text-blue-600 font-semibold hover:text-blue-700"
            >
              Login
            </button>
          </p>
        )}

        <div className="mt-5 text-center">
          <Link to="/" className="text-gray-500 hover:text-gray-700 text-sm">
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;