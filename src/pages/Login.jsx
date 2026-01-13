import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";
import axios from "axios"
import { updateName } from "../redux/appSlice";
import { useDispatch } from "react-redux";




const Login = () => {
  let dispatch = useDispatch();
  const navigate = useNavigate();  
  const [loading, setloading] = useState(false)
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },

    onSubmit: async (values) => {
      try {
        setloading(true)
        const response = await axios.post('http://localhost:5007/api/v1/login', values);

        if (response.data.status) {
          alert(response.data.message)
          console.log(response.data);
          localStorage.setItem("token", response.data.token)

          let user = response.data.user
          dispatch(updateName(user.fullName))
          localStorage.setItem("user", JSON.stringify(user))
          navigate("/Home");

        } else {
          alert(response.data.message)

        }
        setloading(false)
      } catch (error) {
        console.log(error);
        setloading(false)
      }
    },


    validationSchema: yup.object({
      email: yup
        .string("")
        .email("invalid email format")
        .required("Email is required"),
      password: yup
        .string("")
        .required("Password is required")
        .min(8, "password must be at least 8 characters")
        .matches(
          /[A-Z]+/,
          "Password must contain at least one uppercase letter"
        )
        .matches(/\d+/, "Password must contain at least one number")
        .matches(
          /[@$!%*#?&]+/,
          "Password must contain at least one special character"
        ),
    }),
  });


  return (
    <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
      <div className="card shadow-lg p-4" style={{ width: "25rem", borderRadius: "1rem" }}>
        <div className="text-center mb-4">
          <h3 className="fw-bold text-primary">Welcome Back 👋</h3>
          <p className="text-muted">Login to continue</p>
        </div>

        
        <input
          type="text"
          name="email"
          placeholder="Enter your Email"
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          className={`form-control rounded-pill p-2 form-label fw-semibold ${(formik.touched.email && formik.errors.email) && "is-invalid"} ${(formik.touched.email && !formik.errors.email) && "is-valid"}`}
        />
        {formik.touched.email && <small className="text-danger">{formik.errors.email}</small>} <br />

        <input
          type="text"
          name="password"
          placeholder="Enter your Password"
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          className={`form-control rounded-pill p-2 form-label fw-semibold ${(formik.touched.password && formik.errors.password) && "is-invalid"} ${(formik.touched.password && !formik.errors.password) && "is-valid"}`}
        />
        {formik.touched.password && <small className="text-danger">{formik.errors.password}</small>} <br />

          <button
          type="submit" onClick={formik.handleSubmit}
          className="btn btn-success w-100 rounded-pill py-2 fw-semibold"
        >
          {
            loading ? "Submitting.." : "  Submit"
          }
          </button>
        

        <p className="text-center text-muted mt-4">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-primary fw-semibold text-decoration-none">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;