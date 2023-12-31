import React, { useState, useEffect, useRef } from "react";
import {
  AiOutlineBulb,
  AiOutlineEye,
  AiOutlineEyeInvisible,
} from "react-icons/ai";
import "./Auth.css";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signupUser, signinUser } from "../../Reducers/auth.js";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Test = () => {
  const [isCardFlipped, setIsCardFlipped] = useState(false);

  const [showPassword, setShowPassword] = useState(true);
  const [passowrdhintshow, setPasswordHintShow] = useState(false);
  const [signined, setIsSignined] = useState(true);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [formData2, setFormData2] = useState({
    usernameOrEmail: "",
    password: "",
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleCardToggle = () => {
    navigate("/signin");
    setIsCardFlipped(!isCardFlipped);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(signupUser(formData));
  };

  const { errorsignin, successsignin, errorsignup, successsignup } =
    useSelector((state) => state.user);

  const dashboard = useSelector((state) => state.post.dashboard);

  useEffect(() => {
    if (successsignup == false && errorsignup !== "") {
      toast.error(errorsignup);
    }
    if (successsignup == true && errorsignup !== "") {
      toast.success(errorsignup);
    }
  }, [errorsignup, successsignup]);

  useEffect(() => {
    if (!dashboard && successsignin == false && errorsignin !== "") {
      toast.error(errorsignin);
    } else if (signined && successsignin == true && errorsignin !== "") {
      toast.success("Logout Successfully");
    } else if (!dashboard && successsignin == true && errorsignin !== "") {
      toast.success(errorsignin);
    }
  }, [errorsignin, successsignin, signined, dashboard]);

  const handleSubmit2 = async (e) => {
    e.preventDefault();

    try {
      const response = await dispatch(signinUser(formData2));

      if (response.payload.success) {
        navigate("/post");
      } else {
      }
    } catch (error) {
      console.log("problem in sigin");
    }
  };

  const passwordHint = () => {
    setPasswordHintShow((prev) => !prev);
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
              className={`card ${isCardFlipped ? "active" : ""}`}
              initial={{ rotateY: 0 }}
              animate={{ rotateY: isCardFlipped ? 180 : 0 }}
              transition={{ duration: 0.5 }}
            >
              <div
                className={`outer_wrapper_frame_signup_01_right ${
                  isCardFlipped ? "mirrored-content" : ""
                }`}
              >
                <section>
                  <span> Sign Up </span>
                  <section>
                    <span>Username</span>
                    {
                      <input
                        type="text"
                        name="username"
                        onChange={handleChange}
                        placeholder="Enter your username"
                        value={formData.username}
                      />
                    }
                  </section>
                  { 
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
                  }

                  <section>
                    <span>Password</span>
                    <div className="password-input-container">
                      {
                        <input
                          type={!showPassword ? "text" : "password"}
                          name="password"
                          onChange={handleChange}
                          placeholder="Enter your password"
                          value={formData.password}
                        />
                      }

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
                  <div
                    className="outer_wrapper_frame_signup_01_right_01"
                    onClick={passwordHint}
                  >
                    <AiOutlineBulb /> Password hint
                  </div>

                  {passowrdhintshow && (
                    <div className="outer_wrapper_frame_signup_01_right_01_text_below">
                      Password should be more than 8 Characters , with 1 special
                      character and 1 uppercase letter
                    </div>
                  )}

                  <button onClick={handleSubmit}>Sign Up</button>

                  <p>
                     Already have an account? 
                    
                    <span onClick={handleCardToggle}> Sign in</span>
                  </p>
                </section>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Test;
