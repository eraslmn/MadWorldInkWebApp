import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../css/login.module.css";
import { useAuth } from "../context/AuthContext"; // Use AuthContext

function LoginForm({ toggleView }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { login } = useAuth(); // Access login function from AuthContext
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrors({});

    try {
      const response = await fetch("https://localhost:7213/api/Auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setErrors({ general: errorData.message || "Invalid credentials." });
        return;
      }

      const data = await response.json();
      const userRole = getUserRoleFromToken(data.token);

      // Store the token and role in AuthContext
      login(data.token, userRole);

      if (userRole === "Admin") {
        navigate("/admin-dashboard");
      } else {
        navigate("/");
      }
    } catch (error) {
      setErrors({
        general: "An unexpected error occurred. Please try again later.",
      });
    }
  };

  const getUserRoleFromToken = (token) => {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return (
      payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] ||
      payload.role ||
      "User"
    );
  };

  return (
    <div className={styles["mwi-log-reg__content"]}>
      <div className={styles["mwi-square"]}></div>
      <div className={styles["mwi-user"]}>
        <i className="bx bxs-user"></i>
      </div>
      <h3 className={styles["mwi-log-reg__h"]}>Log In</h3>
      {errors.general && <p className={styles["error"]}>{errors.general}</p>}
      <form onSubmit={handleLogin}>
        <div className={styles["mwi-input__container"]}>
          <i className={`bx bx-user ${styles["mwi-icon"]}`}></i>
          <input
            type="email"
            name="email"
            className={styles["mwi-input"]}
            placeholder="Email..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className={styles["mwi-input__container"]}>
          <i className={`bx bx-lock-alt ${styles["mwi-icon"]}`}></i>
          <input
            type="password"
            name="password"
            className={styles["mwi-input"]}
            placeholder="Password..."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button
          type="submit"
          name="login_user"
          className={styles["mwi-button"]}
        >
          Sign In
        </button>
      </form>
      <p onClick={toggleView} className={styles["mwi-log-reg__p"]}>
        Sign Up instead
        <i
          style={{ transition: ".2s ease" }}
          className={`bx bx-right-arrow-alt ${styles["mwi-sgnup-instead"]}`}
        ></i>
      </p>
      <a href="/" className={styles["mwi-log-reg__p"]}>
        Return&nbsp;<i className="bx bxs-home"></i>
      </a>
      <p className={styles["mwi-copyright"]}>
        <span style={{ fontWeight: 700 }}>
          &#169; 2023 MADWORLDINK
          <br />
          Developed by Era Sulejmani
        </span>
      </p>
    </div>
  );
}

export default LoginForm;
