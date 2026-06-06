import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Button from "../components/common/Button";
import InputBox from "../components/common/InputBox";
import { clearAuthError, loginUser } from "../features/auth/authSlice";

const initialForm = {
  username: "",
  password: "",
  remember: false,
};

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token, loading } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const login_credential = JSON.parse(
      localStorage.getItem("login_credentials"),
    );

    if (login_credential) {
      setFormData(login_credential);
    }
  }, []);
  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));

    setErrors((current) => ({
      ...current,
      [name]: "",
    }));
  };

  const validateForm = () => {
    const nextErrors = {};

    if (!formData.username.trim()) {
      nextErrors.username = "Username is required";
    }

    if (!formData.password) {
      nextErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      nextErrors.password = "Password must be at least 6 characters";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    const result = await dispatch(
      loginUser({
        username: formData.username,
        password: formData.password,
      }),
    );
    
    if (formData.remember) {
      localStorage.setItem("login_credentials", JSON.stringify(formData));
    }
    if (!formData.remember) {
      localStorage.removeItem("login_credentials");
    }

    if (loginUser.fulfilled.match(result)) {
      toast.success(result.payload?.message || "Login successfully");
      // navigate("/", { replace: true });
      return;
    }

    toast.error(result.payload || "Invalid credentials");
    dispatch(clearAuthError());
  };

  if (token) {
    return <Navigate to="/" replace />;
  }

  return (
    <section className="w-full max-w-md">
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/70 sm:p-8">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-emerald-700 text-lg font-bold text-white shadow-lg shadow-emerald-900/20">
            QB
          </div>
          <h1 className="text-2xl font-bold tracking-normal text-slate-950">
            QadriBags Admin
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Sign in to manage your store
          </p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <InputBox
            label="Username"
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Enter your username"
            error={errors.username}
          />

          <InputBox
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            error={errors.password}
          />

          <div className="flex items-center justify-between gap-4 text-sm">
            <label className="flex items-center gap-2 font-medium text-slate-600">
  <input
    type="checkbox"
    name="remember"
    checked={formData.remember}
    onChange={handleChange}
    className="h-4 w-4 rounded border-slate-300 text-emerald-700 focus:ring-emerald-600 checked:bg-emerald-700 checked:border-emerald-700"
  />
  Remember me
</label>

            <a
              href="#forgot-password"
              className="font-semibold text-emerald-700 transition hover:text-emerald-800"
            >
              Forgot password?
            </a>
          </div>

          <Button type="submit" className="cursor-pointer" loading={loading}>
            Login
          </Button>
        </form>
      </div>
    </section>
  );
}

export default Login;
