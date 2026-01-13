import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div
      className="d-flex align-items-center justify-content-center vh-100 text-center"
      style={{
        background: "linear-gradient(135deg, #c3e5ff, #f0d9ff)",
      }}
    >
      <div className="card shadow-lg border-0 p-5" style={{ borderRadius: "1.5rem" }}>
        <h1 className="display-1 fw-bold text-primary">404</h1>
        <h4 className="text-dark mb-3">Oops! Page Not Found 😔</h4>
        <p className="text-muted mb-4">
          The page you’re looking for doesn’t exist or has been moved.
        </p>

        <div>
          <Link to="/Home" className="btn btn-primary rounded-pill px-4 me-2">
            Go Home
          </Link>
          <Link to="/login" className="btn btn-outline-primary rounded-pill px-4">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;