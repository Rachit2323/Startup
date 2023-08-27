import React, { useEffect, useState } from "react";
import {
  AiOutlineBulb,
  AiOutlineEye,
  AiOutlineEyeInvisible,
} from "react-icons/ai";
import "./Test.css";
import { motion } from "framer-motion";

const Test = () => {
  const [isActive, setIsActive] = React.useState(false);
  const [auth, isAuth] = useState(true);

  const [showPassword, setShowPassword] = useState(true);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [formData2, setFormData2] = useState({
    information: "",
    password: "",
  });
  const handleCardFlip = () => {
    setIsActive(!isActive);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleChange2 = (e) => {
    const { name, value } = e.target;
    setFormData2((prevData2) => ({
      ...prevData2,
      [name]: value,
    }));
  };

  return (
    <div className="signup_container_outer">
      <div className="sigup_wrapper_background-image">
        <div className="outer_wrapper_frame_signup_01">
          <div className="outer_wrapper_frame_signup_01_left">
            <span>Welcome to The Think Tribe</span>
            <p>A place to share knowledge and better understand the world.</p>
          </div>
          <div className="outer_wrapper_frame_signup_01_right_00">
            <motion.div
              className={`card ${isActive ? "active" : ""}`}
              onClick={handleCardFlip}
              initial={{ rotateY: 0 }}
              animate={{ rotateY: isActive ? 180 : 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className={`outer_wrapper_frame_signup_01_right ${isActive ? "mirrored-content" : ""}`}>
                <section>
                  <span>{auth ? "Sign Up" : "Sign in"}</span>
                  <section>
                    <span>{auth ? "Username" : "Username or Email"}</span>
                    {auth ? (
                      <input
                        type="text"
                        name="username"
                        onChange={handleChange}
                        placeholder="Enter your username"
                        value={formData.username}
                      />
                    ) : (
                      <input
                        type="text"
                        name="information"
                        onChange={handleChange2}
                        placeholder="Enter your username or email"
                        value={formData.information}
                      />
                    )}
                  </section>
                  {auth && (
                    <section>
                      <span>Email</span>
                      <input
                        type="email"
                        name="email"
                        onChange={handleChange}
                        placeholder="Enter your email"
                        value={formData.email}
                      />
                    </section>
                  )}

                  <section>
                    <span>Password</span>
                    <div className="password-input-container">
                      {auth ? (
                        <input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          onChange={handleChange}
                          placeholder="Enter your password"
                          value={formData.password}
                        />
                      ) : (
                        <input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          onChange={handleChange2}
                          placeholder="Enter your password"
                          value={formData.password}
                        />
                      )}

                      <div
                        className="eye-icon"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <AiOutlineEyeInvisible />
                        ) : (
                          <AiOutlineEye />
                        )}
                      </div>
                    </div>
                  </section>
                  <div className="outer_wrapper_frame_signup_01_right_01">
                    <AiOutlineBulb /> Password hint
                  </div>
                  <button>{auth ? "Sign Up" : "Sign in"}</button>
                  <p>
                    {auth
                      ? "Already have an account?"
                      : "Don't have an account!"}{" "}
                     <span onClick={() => isAuth(!auth)}>
                      {auth ? "Sign in" : "Sign up"}
                    </span>
                  </p>
                </section>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Test;