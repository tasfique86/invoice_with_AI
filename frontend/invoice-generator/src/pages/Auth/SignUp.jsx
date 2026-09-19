import React, { useState } from "react";
import {
  Eye,
  EyeOff,
  Loader2,
  Mail,
  Lock,
  FileText,
  ArrowRight,
  User,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-hot-toast";
import { API_PATHS } from "../../utils/apiPath";
import { axiosInstance } from "../../utils/axiosInstance";
import { useNavigate } from "react-router-dom";
import { FaShieldAlt } from "react-icons/fa";
import { validateEmail, validatePassword } from "../../utils/helper";

const SignUp = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [fieldErrors, setFieldErrors] = useState({
    email: "",
    password: "",
    name: "",
    confirmPassword: "",
  });
  const [touched, setTouched] = useState({
    email: false,
    password: false,
    name: false,
    confirmPassword: false,
  });

  //validation function
  const validate = (fieldName, value) => {
    switch (fieldName) {
      case "email":
        return validateEmail(value);
      case "password":
        return validatePassword(value);
      case "name":
        return validateUsername(value);
      case "confirmPassword":
        return validateConfirmPassword(value, formData.password);
      default:
        return "";
    }
  };

  const validateConfirmPassword = (confirmPassword, password) => {
    if (!confirmPassword) return "Confirm password is required";
    if (confirmPassword !== password) return "Passwords do not match";
    return "";
  };

  const validateUsername = (value) => {
    if (!value) return "name is required";
    if (value.length < 3) return "name must be at least 3 characters";
    if (value.length > 30) return "name must not be more than 30 characters";
    if (!/^[A-Za-z\s]+$/.test(value))
      return "name must contain only letters and spaces";
    return "";
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (touched[name]) {
      const newFieldErrors = { ...fieldErrors };
      if (name === "name") {
        newFieldErrors.name = validateUsername(value);
      } else if (name === "email") {
        newFieldErrors.email = validateEmail(value);
      } else if (name === "password") {
        newFieldErrors.password = validatePassword(value);

        if (touched.confirmPassword) {
          newFieldErrors.confirmPassword = validateConfirmPassword(
            formData.confirmPassword,
            value,
          );
        }
      } else if (name === "confirmPassword") {
        newFieldErrors.confirmPassword = validateConfirmPassword(
          value,
          formData.password,
        );
      }
      setFieldErrors(newFieldErrors);
    }
    setError("");
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));

    const error = validate(name, value);
    setFieldErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const emailError = validate("email", formData.email);
    const passwordError = validate("password", formData.password);
    const nameError = validate("name", formData.name);
    const confirmPasswordError = validate(
      "confirmPassword",
      formData.confirmPassword,
    );

    if (emailError || passwordError || nameError || confirmPasswordError) {
      setFieldErrors({
        email: emailError,
        password: passwordError,
        name: nameError,
        confirmPassword: confirmPasswordError,
      });
      setTouched({
        email: true,
        password: true,
        name: true,
        confirmPassword: true,
      });
      return;
    }
    e;

    setIsLoading(true);
    setError("");
    setSuccess("");
    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
      if (response.status === 201) {
        const { user, token } = response.data;
        setFormData({
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
        });

        setTouched({
          name: false,
          email: false,
          password: false,
          confirmPassword: false,
        });

        //login the user immediately after successful registration
        if (token) {
          login(user, token);
          setSuccess("Registration successful");

          // Redirect to dashboard
          setTimeout(() => {
            navigate("/dashboard");
          }, 2000);
        }
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response?.data?.message);
      } else {
        setError("An error occurred during registration");
      }
      console.error("API error:", err.response || err);
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = () => {
    return (
      formData.email &&
      formData.password &&
      formData.name &&
      formData.confirmPassword &&
      !fieldErrors.email &&
      !fieldErrors.password &&
      !fieldErrors.name &&
      !fieldErrors.confirmPassword
    );
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-sm">
        {/* header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-linear-to-r from-blue-950 to-blue-500 rounded-xl mx-auto mb-6 flex items-center justify-center">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl text-center text-gray-900 font-semibold">
            Create an account
          </h1>
          <p className="text-gray-600 text-sm ">
            Join Invoice Generator to manage your invoices
          </p>
        </div>

        {/* Form */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* full name */}
          <div>
            <label className=" block text-sm font-medium text-gray-700 mb-2">
              Full name
            </label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:border-transparent outline-none transition-all 
                     ${
                       fieldErrors.name && touched.name
                         ? "border-red-300 focus:ring-red-500"
                         : "border-gray-300 focus:ring-black"
                     }`}
                placeholder="Enter your full name"
              />
            </div>
            {fieldErrors.name && touched.name && (
              <p className="text-red-600 text-sm mt-1">{fieldErrors.name}</p>
            )}
          </div>

          {/* email */}
          <div>
            <label className=" block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:border-transparent outline-none transition-all 
                     ${
                       fieldErrors.email && touched.email
                         ? "border-red-300 focus:ring-red-500"
                         : "border-gray-300 focus:ring-black"
                     }`}
                placeholder="Enter your email"
              />
            </div>
            {fieldErrors.email && touched.email && (
              <p className="text-red-600 text-sm mt-1">{fieldErrors.email}</p>
            )}
          </div>

          {/* password */}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                required
                value={formData.password}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent outline-none transition-all 
                     ${
                       fieldErrors.password && touched.password
                         ? "border-red-300 focus:ring-red-500"
                         : "border-gray-300 focus:ring-black"
                     }`}
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
            {fieldErrors.password && touched.password && (
              <p className="text-red-600 text-sm mt-1">
                {fieldErrors.password}
              </p>
            )}
          </div>

          {/* confirm password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                required
                value={formData.confirmPassword}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent outline-none transition-all 
                     ${
                       fieldErrors.confirmPassword && touched.confirmPassword
                         ? "border-red-300 focus:ring-red-500"
                         : "border-gray-300 focus:ring-black"
                     }`}
                placeholder="Confirm your password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400"
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
            {fieldErrors.confirmPassword && touched.confirmPassword && (
              <p className="text-red-600 text-sm mt-1">
                {fieldErrors.confirmPassword}
              </p>
            )}
          </div>

          {error && (
            <div className="text-red-600 text-sm mt-1">
              <p className="">{error}</p>
            </div>
          )}

          {success && (
            <div className="text-green-600 text-sm mt-1">
              <p className="">{success}</p>
            </div>
          )}

          {/* terms and conditions */}
          <div className="flex items-start pt-2">
            <input
              type="checkbox"
              id="terms"
              required
              value={formData.terms}
              onChange={handleInputChange}
              onBlur={handleBlur}
              className={`w-4 h-4 text-black border-gray-300 rounded  focus:ring-black mt-0.5`}
            />
            <label htmlFor="terms" className="text-sm text-gray-600 ml-2">
              I agree to the{" "}
              <button className="text-black hover:underline">
                Terms of Service
              </button>{" "}
              and{" "}
              <button className="text-black hover:underline">
                Privacy Policy
              </button>
            </label>
          </div>

          {/* sign up button */}
          <button
            type="submit"
            disabled={isLoading || !isFormValid()}
            className="group w-full bg-linear-to-r from-blue-950 to-blue-900 text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-800  disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
          >
            {isLoading ? (
              <>
                {" "}
                <Loader2 className="animate-spin w-4 h-4 mr-2" />
                Creating Account...
              </>
            ) : (
              <>
                Sign Up
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />{" "}
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <button
              onClick={() => navigate("/signin")}
              className="text-black hover:underline font-medium"
            >
              Sign In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
