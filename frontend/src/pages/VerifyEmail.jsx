import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const VerifyEmail = () => {
  const [code, setCode] = useState("");
  const navigate = useNavigate();

  const handleVerification = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${'http://localhost:8000/api/v1'}/auth/verify-email`,
        { code }
      );

      if (response.data.success) {
        alert(response.data.message); 
        navigate("/"); // N
      }
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Verification failed. Please try again."
      ); 
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#f4f4f4",
      }}
    >
      <div
        style={{
          padding: "20px",
          backgroundColor: "#fff",
          borderRadius: "8px",
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
          Verify Your Email
        </h2>
        <form onSubmit={handleVerification}>
          <div style={{ marginBottom: "15px" }}>
            <label
              htmlFor="code"
              style={{ display: "block", marginBottom: "5px" }}
            >
              Verification Code
            </label>
            <input
              type="text"
              id="code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Enter the code sent to your email"
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "5px",
                border: "1px solid #ccc",
                boxSizing: "border-box",
              }}
              required
            />
          </div>
          <button
            type="submit"
            style={{
              width: "100%",
              padding: "10px",
              backgroundColor: "#4CAF50",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Verify
          </button>
        </form>
      </div>
    </div>
  );
};

export default VerifyEmail;
