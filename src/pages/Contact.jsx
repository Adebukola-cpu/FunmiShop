import React from "react";

const Contact = () => {
  return (
    <div
      className="min-vh-100 d-flex align-items-center justify-content-center"
      style={{
        background: "linear-gradient(135deg, #dbeafe, #fce7f3)",
        padding: "2rem",
      }}
    >
      <div
        className="card shadow-lg border-0 w-100"
        style={{ maxWidth: "800px", borderRadius: "1.5rem" }}
      >
        <div className="row g-0">
          {/* Left side – contact info */}
          <div
            className="col-md-5 text-white d-flex flex-column justify-content-center p-4"
            style={{
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              borderRadius: "1.5rem 0 0 1.5rem",
            }}
          >
            <h3 className="fw-bold mb-3">Get in Touch 📞</h3>

            <p className="mb-2">
              <i className="bi bi-telephone-fill me-2"></i>
              <strong>Phone:</strong> +234 808 803 3643
            </p>

            <p className="mb-2">
              <i className="bi bi-envelope-fill me-2"></i>
              <strong>Email:</strong> bukolaoseni97@gmail.com
            </p>

            <p className="mb-4">
              <i className="bi bi-geo-alt-fill me-2"></i>
              <strong>Address:</strong> Bovas Bus Stop, Osogbo, Osun State
            </p>

            <p className="text-light small">
              We’d love to hear from you — whether it’s feedback, questions, or
              partnership opportunities.
            </p>
          </div>

          {/* Right side – contact form */}
          <div className="col-md-7 p-5 bg-white rounded-end">
            <h4 className="fw-bold text-primary mb-4">Send Us a Message</h4>

            <form>
              <div className="mb-3">
                <label className="form-label fw-semibold">Full Name</label>
                <input
                  type="text"
                  className="form-control rounded-pill p-2"
                  placeholder="Enter your name"
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">Email Address</label>
                <input
                  type="email"
                  className="form-control rounded-pill p-2"
                  placeholder="Enter your email"
                />
              </div>

              <div className="mb-4">
                <label className="form-label fw-semibold">Message</label>
                <textarea
                  className="form-control rounded-4 p-3"
                  rows="4"
                  placeholder="Write your message here..."
                ></textarea>
              </div>

              <button
                type="submit"
                className="btn btn-primary w-100 rounded-pill py-2 fw-semibold"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;