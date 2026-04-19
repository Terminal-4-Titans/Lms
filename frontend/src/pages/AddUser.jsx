import React, { useState } from "react";
import axios from "axios";

function AddUser() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [otp, setOtp] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const sendOtp = async () => {
    if (!form.email || !form.name || !form.password) {
      alert("Please fill in basic details first");
      return;
    }
    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post("http://127.0.0.1:5000/user/send-otp", {
        email: form.email
      });

      if (res.data.success) {
        alert("OTP sent to email");
        setShowOtp(true);
      } else {
        alert(res.data.message);
      }
    } catch (error) {
      alert(error.response?.data?.message || "Send OTP failed");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    try {
      const res = await axios.post("http://127.0.0.1:5000/user/verify-otp", {
        email: form.email,
        otp: otp
      });

      if (res.data.success) {
        const createRes = await axios.post("http://127.0.0.1:5000/user/create", {
          name: form.name,
          email: form.email,
          password: form.password,
        });
        alert(createRes.data.message);
        // Clear form after success
        setShowOtp(false);
      } else {
        alert(res.data.message);
      }
    } catch (error) {
      alert(error.response?.data?.message || "User creation failed");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Register New User</h2>
        <p style={styles.subtitle}>Fill in the details to create a new member account.</p>
      </div>

      <div style={styles.formGrid}>
        <div style={styles.inputBox}>
          <label style={styles.label}>Full Name</label>
          <input name="name" style={styles.input} placeholder="John Doe" value={form.name} onChange={handleChange} />
        </div>

        <div style={styles.inputBox}>
          <label style={styles.label}>Email Address</label>
          <input name="email" style={styles.input} placeholder="john@example.com" value={form.email} onChange={handleChange} />
        </div>

        <div style={styles.inputBox}>
          <label style={styles.label}>Phone Number</label>
          <input name="phone" style={styles.input} placeholder="+1 234 567 890" value={form.phone} onChange={handleChange} />
        </div>

        <div style={styles.inputBox}>
          <label style={styles.label}>Residential Address</label>
          <input name="address" style={styles.input} placeholder="Street, City, Country" value={form.address} onChange={handleChange} />
        </div>

        <div style={styles.inputBox}>
          <label style={styles.label}>Password</label>
          <input name="password" type="password" style={styles.input} placeholder="••••••••" value={form.password} onChange={handleChange} />
        </div>

        <div style={styles.inputBox}>
          <label style={styles.label}>Confirm Password</label>
          <input name="confirmPassword" type="password" style={styles.input} placeholder="••••••••" value={form.confirmPassword} onChange={handleChange} />
        </div>

        <div style={{ ...styles.inputBox, gridColumn: "span 2" }}>
          <label style={styles.label}>Profile Photo</label>
          <input type="file" style={styles.fileInput} />
        </div>
      </div>

      {!showOtp ? (
        <button style={styles.primaryBtn} onClick={sendOtp} disabled={loading}>
          {loading ? "Sending..." : "Request OTP Verification"}
        </button>
      ) : (
        <div style={styles.otpSection}>
          <div style={styles.otpHeader}>
            <span>Verification Required</span>
            <p>Enter the 6-digit code sent to {form.email}</p>
          </div>
          <div style={styles.otpActionGroup}>
            <input
              style={styles.otpInput}
              placeholder="000000"
              maxLength="6"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <button style={styles.verifyBtn} onClick={verifyOtp}>Verify & Register</button>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: "20px",
    maxWidth: "800px",
    margin: "0 auto",
  },
  header: {
    marginBottom: "30px",
    borderBottom: "1px solid #eee",
    paddingBottom: "15px",
  },
  title: {
    fontSize: "1.5rem",
    color: "#1a237e",
    margin: 0,
  },
  subtitle: {
    fontSize: "0.9rem",
    color: "#64748b",
    marginTop: "5px",
  },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px",
  },
  inputBox: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  label: {
    fontSize: "0.85rem",
    fontWeight: "600",
    color: "#475569",
  },
  input: {
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #e2e8f0",
    fontSize: "0.95rem",
    outline: "none",
    transition: "border-color 0.2s",
  },
  fileInput: {
    padding: "10px",
    fontSize: "0.9rem",
    color: "#64748b",
  },
  primaryBtn: {
    marginTop: "30px",
    padding: "15px 25px",
    backgroundColor: "#1a237e",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontWeight: "600",
    cursor: "pointer",
    width: "100%",
  },
  otpSection: {
    marginTop: "30px",
    padding: "20px",
    backgroundColor: "#f8fafc",
    borderRadius: "12px",
    border: "1px dashed #cbd5e1",
    textAlign: "center",
  },
  otpHeader: {
    marginBottom: "15px",
    fontWeight: "700",
    color: "#1e293b",
  },
  otpActionGroup: {
    display: "flex",
    gap: "10px",
    justifyContent: "center",
  },
  otpInput: {
    width: "120px",
    padding: "12px",
    textAlign: "center",
    fontSize: "1.2rem",
    fontWeight: "bold",
    letterSpacing: "4px",
    borderRadius: "8px",
    border: "2px solid #1a237e",
  },
  verifyBtn: {
    padding: "0 25px",
    backgroundColor: "#10b981",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontWeight: "600",
    cursor: "pointer",
  },
};

export default AddUser;