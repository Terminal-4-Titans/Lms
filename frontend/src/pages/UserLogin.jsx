import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function UserLogin() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [otp, setOtp] = useState("");
    const [showOtp, setShowOtp] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await axios.post("http://127.0.0.1:5000/user/login", {
                email: email,
                password: password
            });

            if (res.data.success) {
                alert("OTP sent to your Gmail");
                setShowOtp(true);
            } else {
                alert(res.data.message);
            }
        } catch (error) {
            console.log(error);
            alert("Invalid User or Password");
        } finally {
            setLoading(false);
        }
    };

    const verifyOtp = async () => {
        try {
            const res = await axios.post("http://127.0.0.1:5000/user/verify-login-otp", {
                email: email,
                otp: otp
            });

            if (res.data.success) {
                localStorage.setItem("user_id", res.data.user.id);
                localStorage.setItem("user_name", res.data.user.name);
                alert("Login Successful");
                navigate("/user-dashboard");
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
                        A library is not a luxury but one of the necessities of life.
                    </p>
                    <span style={styles.quoteAuthor}>— Henry Ward Beecher</span>
                </div>
            </div>

            {/* LOGIN CARD */}
            <div style={styles.loginCard}>
                <button style={styles.backBtn} onClick={() => navigate("/")}>
                    ← Back
                </button>

                {!showOtp ? (
                    <>
                        <div style={styles.headerSection}>
                            <div style={styles.iconCircle}>
                                <svg width="35" height="35" viewBox="0 0 24 24" fill="none" stroke="#5d4037" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                            </div>
                            <h2 style={styles.title}>Member Login</h2>
                            <p style={styles.subtitle}>Access your library account</p>
                        </div>

                        <form onSubmit={handleLogin} style={styles.form}>
                            <div style={styles.inputGroup}>
                                <label style={styles.label}>Email Address</label>
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    style={styles.input}
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>

                            <div style={styles.inputGroup}>
                                <label style={styles.label}>Password</label>
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    style={styles.input}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>

                            <button type="submit" style={styles.submitBtn} disabled={loading}>
                                {loading ? "Processing..." : "Login"}
                            </button>
                        </form>

                        <div style={styles.extraLinks}>
                            <button onClick={() => navigate("/user-signup")} style={styles.linkBtn}>Create Account</button>
                            <span style={styles.divider}>|</span>
                            <button onClick={() => navigate("/forgot-password")} style={styles.linkBtn}>Forgot Password?</button>
                        </div>
                    </>
                ) : (
                    <div style={styles.otpSection}>
                        <div style={styles.iconCircleOtp}>
                            <span style={{ fontSize: '30px' }}>✉️</span>
                        </div>
                        <h2 style={styles.title}>Verify OTP</h2>
                        <p style={styles.subtitle}>Enter the code sent to your email</p>

                        <input
                            placeholder="0 0 0 0 0 0"
                            maxLength="6"
                            style={styles.otpInput}
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                        />

                        <button onClick={verifyOtp} style={styles.verifyBtn}>Confirm & Login</button>
                        <button onClick={() => setShowOtp(false)} style={styles.cancelLink}>Change details</button>
                    </div>
                )}
            </div>

            {/* RIGHT SIDE DECORATION */}
            <div style={styles.rightDecor}>
                <div style={styles.circle1}></div>
                <div style={styles.circle2}></div>
                <div style={styles.bookIconLarge}>📖</div>
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
        backgroundColor: "#fcfaf7", // Warm Paper Background
        fontFamily: "'Inter', sans-serif",
        position: "relative",
        overflow: "hidden",
    },
    leftDecor: {
        position: "absolute",
        left: "5%",
        maxWidth: "280px",
        zIndex: 0,
    },
    quoteBox: {
        borderLeft: "4px solid #5d4037",
        paddingLeft: "20px",
    },
    quoteMark: {
        fontSize: "4rem",
        color: "#5d4037",
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
        color: "#5d4037",
        textTransform: "uppercase",
    },
    loginCard: {
        backgroundColor: "white",
        width: "90%",
        maxWidth: "400px",
        padding: "45px",
        borderRadius: "24px",
        boxShadow: "0 20px 50px rgba(0,0,0,0.06)",
        border: "1px solid #f1f1f1",
        zIndex: 1,
        position: "relative",
        textAlign: "center",
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
        marginBottom: "30px",
    },
    iconCircle: {
        width: "60px",
        height: "60px",
        backgroundColor: "#efebe9", // Lite Wood Brown
        borderRadius: "15px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        margin: "10px auto 20px auto",
    },
    title: {
        fontSize: "1.8rem",
        color: "#3e2723", // Dark Wood
        fontWeight: "800",
        margin: "0",
    },
    subtitle: {
        fontSize: "0.95rem",
        color: "#90a4ae",
        marginTop: "5px",
    },
    form: {
        display: "flex",
        flexDirection: "column",
        gap: "18px",
        textAlign: "left",
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
        paddingLeft: "5px",
    },
    input: {
        padding: "14px",
        borderRadius: "12px",
        border: "2px solid #edf2f4",
        fontSize: "1rem",
        outline: "none",
        transition: "border-color 0.2s",
        fontFamily: "inherit",
    },
    submitBtn: {
        padding: "16px",
        backgroundColor: "#1a237e", // Oxford Blue
        color: "white",
        border: "none",
        borderRadius: "12px",
        fontSize: "1rem",
        fontWeight: "700",
        cursor: "pointer",
        marginTop: "10px",
        boxShadow: "0 8px 15px rgba(26, 35, 126, 0.2)",
        transition: "transform 0.2s",
    },
    extraLinks: {
        marginTop: "25px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "10px",
    },
    linkBtn: {
        background: "none",
        border: "none",
        color: "#5d4037",
        fontSize: "0.85rem",
        fontWeight: "600",
        cursor: "pointer",
        textDecoration: "underline",
    },
    divider: { color: "#cfd8dc" },

    // OTP Section
    otpSection: { textAlign: "center" },
    iconCircleOtp: { marginBottom: "15px" },
    otpInput: {
        width: "100%",
        padding: "15px",
        marginTop: "20px",
        borderRadius: "12px",
        border: "2px solid #1a237e",
        fontSize: "1.5rem",
        textAlign: "center",
        letterSpacing: "8px",
        fontWeight: "bold",
        color: "#1a237e",
        outline: "none",
    },
    verifyBtn: {
        width: "100%",
        padding: "15px",
        marginTop: "20px",
        backgroundColor: "#1a237e",
        color: "white",
        border: "none",
        borderRadius: "12px",
        fontWeight: "700",
        cursor: "pointer",
    },
    cancelLink: {
        display: "block",
        marginTop: "15px",
        background: "none",
        border: "none",
        color: "#90a4ae",
        cursor: "pointer",
        fontSize: "0.85rem",
    },

    // RIGHT DECORATION
    rightDecor: {
        position: "absolute",
        right: "-50px",
        top: "10%",
        zIndex: 0,
    },
    circle1: {
        width: "300px",
        height: "300px",
        borderRadius: "50%",
        backgroundColor: "#efebe9",
        position: "absolute",
        right: "0",
    },
    circle2: {
        width: "200px",
        height: "200px",
        borderRadius: "50%",
        backgroundColor: "#e8eaf6",
        position: "absolute",
        right: "50px",
        top: "150px",
    },
    bookIconLarge: {
        fontSize: "150px",
        position: "absolute",
        right: "100px",
        top: "200px",
        opacity: 0.1,
    }
};

export default UserLogin;