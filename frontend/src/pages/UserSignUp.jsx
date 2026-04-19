import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function UserSignUp() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    });

    const [otp, setOtp] = useState("");
    const [showOtp, setShowOtp] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const sendOtp = async () => {
        try {
            if (!form.name || !form.email || !form.password || !form.confirmPassword) {
                alert("Please fill all fields");
                return;
            }

            if (form.password !== form.confirmPassword) {
                alert("Password and Confirm Password do not match");
                return;
            }

            setLoading(true);
            const res = await axios.post("http://127.0.0.1:5000/user/send-otp", {
                email: form.email
            });

            if (res.data.success) {
                alert("Verification code sent to your email");
                setShowOtp(true);
            } else {
                alert(res.data.message);
            }
        } catch (error) {
            console.log(error);
            alert(error.response?.data?.message || "Failed to send OTP");
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
                    password: form.password
                });

                if (createRes.data.success) {
                    alert("Account created successfully! Welcome to LibSource.");
                    navigate("/user-login");
                } else {
                    alert(createRes.data.message);
                }
            } else {
                alert(res.data.message);
            }
        } catch (error) {
            console.log(error);
            alert("OTP verification failed");
        }
    };

    return (
        <div style={styles.container}>
            {/* LEFT SIDE DECORATION */}
            <div style={styles.leftDecor}>
                <div style={styles.quoteBox}>
                    <span style={styles.quoteMark}>“</span>
                    <p style={styles.quoteText}>
                        Everything you need for better future and success has already been written. 
                        And guess what? All you have to do is go to the library.
                    </p>
                    <span style={styles.quoteAuthor}>— Jim Rohn</span>
                </div>
            </div>

            {/* SIGN UP CARD */}
            <div style={styles.card}>
                <button style={styles.backBtn} onClick={() => navigate("/user-login")}>
                    ← Back to Login
                </button>

                {!showOtp ? (
                    <>
                        <div style={styles.headerSection}>
                            <div style={styles.iconCircle}>
                                <svg width="35" height="35" viewBox="0 0 24 24" fill="none" stroke="#1a237e" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><line x1="19" y1="8" x2="19" y2="14"></line><line x1="22" y1="11" x2="16" y2="11"></line></svg>
                            </div>
                            <h2 style={styles.title}>Create Account</h2>
                            <p style={styles.subtitle}>Join our community of readers</p>
                        </div>

                        <div style={styles.form}>
                            <div style={styles.inputGroup}>
                                <label style={styles.label}>Full Name</label>
                                <input
                                    name="name"
                                    placeholder="Enter your name"
                                    style={styles.input}
                                    value={form.name}
                                    onChange={handleChange}
                                />
                            </div>

                            <div style={styles.inputGroup}>
                                <label style={styles.label}>Email Address</label>
                                <input
                                    name="email"
                                    type="email"
                                    placeholder="yourname@gmail.com"
                                    style={styles.input}
                                    value={form.email}
                                    onChange={handleChange}
                                />
                            </div>

                            <div style={styles.inputGrid}>
                                <div style={styles.inputGroup}>
                                    <label style={styles.label}>Password</label>
                                    <input
                                        name="password"
                                        type="password"
                                        placeholder="••••••••"
                                        style={styles.input}
                                        value={form.password}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div style={styles.inputGroup}>
                                    <label style={styles.label}>Confirm</label>
                                    <input
                                        name="confirmPassword"
                                        type="password"
                                        placeholder="••••••••"
                                        style={styles.input}
                                        value={form.confirmPassword}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <button onClick={sendOtp} style={styles.submitBtn} disabled={loading}>
                                {loading ? "Sending OTP..." : "Get Started & Verify"}
                            </button>
                        </div>
                    </>
                ) : (
                    <div style={styles.otpSection}>
                        <div style={styles.iconCircleOtp}>
                             <span style={{fontSize: '30px'}}>🛡️</span>
                        </div>
                        <h2 style={styles.title}>Almost There!</h2>
                        <p style={styles.subtitle}>
                            We've sent a code to <br/>
                            <strong style={{color: '#1a237e'}}>{form.email}</strong>
                        </p>
                        
                        <input
                            placeholder="0 0 0 0 0 0"
                            maxLength="6"
                            style={styles.otpInput}
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                        />

                        <button onClick={verifyOtp} style={styles.verifyBtn}>Verify & Create Account</button>
                        <button onClick={() => setShowOtp(false)} style={styles.cancelLink}>Go back to details</button>
                    </div>
                )}
            </div>

            {/* RIGHT SIDE DECORATION */}
            <div style={styles.rightDecor}>
                <div style={styles.circle1}></div>
                <div style={styles.circle2}></div>
                <div style={styles.bookIconLarge}>📚</div>
            </div>
        </div>
    );
}

const styles = {
    container: {
        height: "100vh",
        width: "100vw",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fcfaf7",
        fontFamily: "'Inter', sans-serif",
        position: "relative",
        overflow: "hidden",
    },
    leftDecor: {
        position: "absolute",
        left: "5%",
        maxWidth: "300px",
        zIndex: 0,
        opacity: 0.7,
    },
    quoteBox: {
        borderLeft: "4px solid #1a237e",
        paddingLeft: "20px",
    },
    quoteMark: {
        fontSize: "4rem",
        color: "#1a237e",
        lineHeight: "0",
        display: "block",
        marginBottom: "20px",
        fontFamily: "serif",
        opacity: 0.3,
    },
    quoteText: {
        fontSize: "1.1rem",
        color: "#546e7a",
        fontStyle: "italic",
        lineHeight: "1.6",
    },
    quoteAuthor: {
        display: "block",
        marginTop: "10px",
        fontSize: "0.85rem",
        fontWeight: "bold",
        color: "#1a237e",
        textTransform: "uppercase",
    },
    card: {
        backgroundColor: "white",
        width: "90%",
        maxWidth: "480px",
        padding: "45px",
        borderRadius: "28px",
        boxShadow: "0 20px 50px rgba(0,0,0,0.06)",
        border: "1px solid #f1f1f1",
        zIndex: 1,
        position: "relative",
    },
    backBtn: {
        position: "absolute",
        top: "20px",
        left: "20px",
        background: "none",
        border: "none",
        color: "#90a4ae",
        cursor: "pointer",
        fontSize: "0.85rem",
        fontWeight: "600",
    },
    headerSection: {
        textAlign: "center",
        marginBottom: "30px",
    },
    iconCircle: {
        width: "60px",
        height: "60px",
        backgroundColor: "#e8eaf6",
        borderRadius: "18px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        margin: "0 auto 15px auto",
    },
    title: {
        fontSize: "1.8rem",
        color: "#1a237e",
        fontWeight: "800",
        margin: "0",
    },
    subtitle: {
        fontSize: "0.95rem",
        color: "#78909c",
        marginTop: "5px",
    },
    form: {
        display: "flex",
        flexDirection: "column",
        gap: "15px",
    },
    inputGrid: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "15px",
    },
    inputGroup: {
        display: "flex",
        flexDirection: "column",
        gap: "8px",
    },
    label: {
        fontSize: "0.85rem",
        fontWeight: "700",
        color: "#455a64",
        paddingLeft: "4px",
    },
    input: {
        padding: "14px",
        borderRadius: "12px",
        border: "2px solid #edf2f4",
        fontSize: "1rem",
        outline: "none",
        transition: "border-color 0.2s",
        backgroundColor: "#fcfcfc",
    },
    submitBtn: {
        padding: "16px",
        backgroundColor: "#1a237e",
        color: "white",
        border: "none",
        borderRadius: "12px",
        fontSize: "1rem",
        fontWeight: "700",
        cursor: "pointer",
        marginTop: "10px",
        boxShadow: "0 8px 20px rgba(26, 35, 126, 0.2)",
        transition: "all 0.3s ease",
    },
    otpSection: {
        textAlign: "center",
    },
    iconCircleOtp: {
        marginBottom: "20px",
    },
    otpInput: {
        width: "100%",
        padding: "15px",
        marginTop: "20px",
        borderRadius: "12px",
        border: "2px solid #1a237e",
        fontSize: "1.8rem",
        textAlign: "center",
        letterSpacing: "10px",
        fontWeight: "bold",
        color: "#1a237e",
        outline: "none",
        backgroundColor: "#f8f9fa",
    },
    verifyBtn: {
        width: "100%",
        padding: "16px",
        marginTop: "25px",
        backgroundColor: "#10b981", // Success Green
        color: "white",
        border: "none",
        borderRadius: "12px",
        fontSize: "1rem",
        fontWeight: "700",
        cursor: "pointer",
        boxShadow: "0 8px 15px rgba(16, 185, 129, 0.2)",
    },
    cancelLink: {
        marginTop: "15px",
        background: "none",
        border: "none",
        color: "#90a4ae",
        cursor: "pointer",
        fontSize: "0.85rem",
        textDecoration: "underline",
    },
    rightDecor: {
        position: "absolute",
        right: "-50px",
        bottom: "5%",
        zIndex: 0,
    },
    circle1: {
        width: "280px",
        height: "280px",
        borderRadius: "50%",
        backgroundColor: "#e3f2fd",
        position: "absolute",
        right: "0",
    },
    circle2: {
        width: "180px",
        height: "180px",
        borderRadius: "50%",
        backgroundColor: "#fdf5e6",
        position: "absolute",
        right: "60px",
        bottom: "80px",
    },
    bookIconLarge: {
        fontSize: "120px",
        position: "absolute",
        right: "100px",
        bottom: "120px",
        opacity: 0.1,
    }
};

export default UserSignUp;