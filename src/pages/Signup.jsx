import React, { useState } from "react";
import { Link } from "react-router-dom";
import * as yup from "yup";
import {useFormik} from "formik";
import axios from "axios";
import { useNavigate } from "react-router-dom";



const Signup = () => {
  const [image, setimage] = useState(null)
  const [loading, setloading] = useState("")

  const handleImage = (e) => {
    console.log(e.target.files[0]);
    let picture = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(picture)
    reader.onloadend = () => {
      const data = reader.result
      console.log(data)
      setimage(data)
    };
  };

  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    },

    onSubmit: async (values) => {
      try {
        console.log(values);
        setloading(true)

        const response = await axios.post('http://localhost:5007/api/v1/signUp', {
          profilePicture: image,
          ...values
        })

        if (response.data.status) {
          alert(response.data.message)
          navigate("/Login");
        }

        setloading(false)
      } catch (error) {
        alert(error.response.data.message)
        setloading(false)
      }
    },


    validationSchema: yup.object({
      firstName: yup.string("").required("firstname is required"),
      lastName: yup.string("").required("lastname is required"),
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
          <h3 className="fw-bold text-success">Create Account ✨</h3>
          <p className="text-muted">Join us and start your journey today</p>
        </div>

          <div>
        <img src={image} alt="" width={100} height={100} /> <br />
        <input type="file" onChange={(e) => handleImage(e)} />
        </div> <br />
      
            <input
              type="text"
              name="firstName"
              placeholder="Enter your First name"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
            className={`form-control rounded-pill p-2 form-label fw-semibold ${(formik.touched.firstName && formik.errors.firstName) && "is-invalid"} ${(formik.touched.firstName && !formik.errors.firstName) && "is-valid"}`}
            />
            {formik.touched.firstName && <small className="text-danger">{formik.errors.firstName}</small>} <br />
         

          <input
              type="text"
              name="lastName"
              placeholder="Enter your Last name"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
            className={`form-control rounded-pill p-2 form-label fw-semibold ${(formik.touched.lastName && formik.errors.lastName) && "is-invalid"} ${(formik.touched.lastName && !formik.errors.lastName) && "is-valid"}`}
            />
            {formik.touched.firstName && <small className="text-danger">{formik.errors.lastName}</small>} <br />

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
          Already have an account?{" "}
          <Link to="/login" className="text-success fw-semibold text-decoration-none">
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;