import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function ForgotPassword() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showReset, setShowReset] = useState(false);
    const [loading, setLoading] = useState(false);

    const sendOtp = async () => {
        try {
            if (!email) {
                alert("Please enter your registered email address");
                return;
            }

            setLoading(true);
            const res = await axios.post("http://127.0.0.1:5000/user/forgot-password-send-otp", {
                email: email
            });

            if (res.data.success) {
                alert("Verification code dispatched to your email");
                setShowReset(true);
            } else {
                alert(res.data.message);
            }
        } catch (error) {
            console.log(error);
            alert(error.response?.data?.message || "Failed to send OTP. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const resetPassword = async () => {
        try {
            if (!otp || !newPassword || !confirmPassword) {
                alert("All security fields are mandatory");
                return;
            }

            if (newPassword !== confirmPassword) {
                alert("Passwords do not match. Please re-check.");
                return;
            }

            setLoading(true);
            const res = await axios.post("http://127.0.0.1:5000/user/reset-password", {
                email: email,
                otp: otp,
                new_password: newPassword
            });

            if (res.data.success) {
                alert("Security credentials updated. You can now login.");
                navigate("/user-login");
            } else {
                alert(res.data.message);
            }
        } catch (error) {
            console.log(error);
            alert(error.response?.data?.message || "Internal error during password reset");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            {/* LEFT SIDE DECORATION */}
            <div style={styles.leftDecor}>
                <div style={styles.quoteBox}>
                    <span style={styles.quoteMark}>“</span>
                    <p style={styles.quoteText}>
                        Education is the key to unlock the golden door of freedom.
                    </p>
                    <span style={styles.quoteAuthor}>— George Washington Carver</span>
                </div>
            </div>

            {/* RESET CARD */}
            <div style={styles.card}>
                <button style={styles.backBtn} onClick={() => navigate("/user-login")}>
                    ← Back to Login
                </button>

                <div style={styles.headerSection}>
                    <div style={styles.iconCircle}>
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#1a237e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3m-3-3l-2.5-2.5"></path>
                        </svg>
                    </div>
                    <h2 style={styles.title}>Account Recovery</h2>
                    <p style={styles.subtitle}>Reset your secure access credentials</p>
                </div>

                <div style={styles.form}>
                    {!showReset ? (
                        <div style={styles.stepContainer}>
                            <div style={styles.inputGroup}>
                                <label style={styles.label}>Registered Email</label>
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    style={styles.input}
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <button onClick={sendOtp} style={styles.primaryBtn} disabled={loading}>
                                {loading ? "Verifying..." : "Send Verification Code"}
                            </button>
                        </div>
                    ) : (
                        <div style={styles.stepContainer}>
                            <div style={styles.otpNotice}>
                                📧 Verification code sent to: <br/> <strong>{email}</strong>
                            </div>

                            <div style={styles.inputGroup}>
                                <label style={styles.label}>Security Code (OTP)</label>
                                <input
                                    type="text"
                                    placeholder="Enter 6-digit code"
                                    style={styles.otpInput}
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                />
                            </div>

                            <div style={styles.inputGrid}>
                                <div style={styles.inputGroup}>
                                    <label style={styles.label}>New Password</label>
                                    <input
                                        type="password"
                                        placeholder="••••••••"
                                        style={styles.input}
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                    />
                                </div>
                                <div style={styles.inputGroup}>
                                    <label style={styles.label}>Confirm</label>
                                    <input
                                        type="password"
                                        placeholder="••••••••"
                                        style={styles.input}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                    />
                                </div>
                            </div>

                            <button onClick={resetPassword} style={styles.primaryBtn} disabled={loading}>
                                {loading ? "Updating..." : "Update Password"}
                            </button>

                            <button onClick={() => setShowReset(false)} style={styles.cancelLink}>
                                Use a different email
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* RIGHT SIDE DECORATION */}
            <div style={styles.rightDecor}>
                <div style={styles.circle1}></div>
                <div style={styles.circle2}></div>
                <div style={styles.keyIconLarge}>🔑</div>
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
        backgroundColor: "#fcfaf7", // Warm Paper
        fontFamily: "'Inter', sans-serif",
        position: "relative",
        overflow: "hidden",
    },
    leftDecor: {
        position: "absolute",
        left: "5%",
        maxWidth: "280px",
        zIndex: 0,
        opacity: 0.8,
    },
    quoteBox: { borderLeft: "4px solid #1a237e", paddingLeft: "20px" },
    quoteMark: { fontSize: "4rem", color: "#1a237e", lineHeight: "0", display: "block", marginBottom: "20px", fontFamily: "serif", opacity: 0.3 },
    quoteText: { fontSize: "1.1rem", color: "#546e7a", fontStyle: "italic", lineHeight: "1.6" },
    quoteAuthor: { display: "block", marginTop: "10px", fontSize: "0.85rem", fontWeight: "bold", color: "#1a237e", textTransform: "uppercase" },
    
    card: {
        backgroundColor: "white",
        width: "90%",
        maxWidth: "460px",
        padding: "50px 40px",
        borderRadius: "28px",
        boxShadow: "0 20px 50px rgba(0,0,0,0.06)",
        border: "1px solid #f1f1f1",
        zIndex: 1,
        position: "relative",
        textAlign: "center",
    },
    backBtn: { position: "absolute", top: "25px", left: "25px", background: "none", border: "none", color: "#90a4ae", cursor: "pointer", fontSize: "0.85rem", fontWeight: "600" },
    headerSection: { marginBottom: "35px" },
    iconCircle: { width: "60px", height: "60px", backgroundColor: "#f0f2f5", borderRadius: "50%", display: "flex", alignItems: "center", justifyCenter: "center", margin: "0 auto 15px auto", paddingLeft: '14px', paddingTop: '14px', boxSizing: 'border-box' },
    title: { fontSize: "1.7rem", color: "#1e293b", fontWeight: "800", margin: "0" },
    subtitle: { fontSize: "0.95rem", color: "#78909c", marginTop: "5px" },
    
    form: { textAlign: "left" },
    stepContainer: { display: "flex", flexDirection: "column", gap: "20px" },
    otpNotice: { padding: "12px", backgroundColor: "#e8eaf6", borderRadius: "10px", color: "#1a237e", fontSize: "0.85rem", textAlign: "center", lineHeight: "1.5" },
    
    inputGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" },
    inputGroup: { display: "flex", flexDirection: "column", gap: "8px" },
    label: { fontSize: "0.8rem", fontWeight: "700", color: "#455a64", paddingLeft: "4px", textTransform: "uppercase", letterSpacing: '0.5px' },
    input: { padding: "14px", borderRadius: "12px", border: "2px solid #edf2f4", fontSize: "1rem", outline: "none", backgroundColor: "#fcfcfc", fontFamily: 'inherit' },
    otpInput: { padding: "14px", borderRadius: "12px", border: "2px solid #1a237e", fontSize: "1.2rem", textAlign: "center", fontWeight: "bold", letterSpacing: "5px", color: "#1a237e" },
    
    primaryBtn: { padding: "16px", backgroundColor: "#1a237e", color: "white", border: "none", borderRadius: "12px", fontSize: "1rem", fontWeight: "700", cursor: "pointer", boxShadow: "0 8px 15px rgba(26, 35, 126, 0.2)", transition: "0.3s" },
    cancelLink: { background: "none", border: "none", color: "#90a4ae", cursor: "pointer", fontSize: "0.85rem", textDecoration: "underline", alignSelf: "center" },

    rightDecor: { position: "absolute", right: "-50px", bottom: "10%", zIndex: 0 },
    circle1: { width: "300px", height: "300px", borderRadius: "50%", backgroundColor: "#efebe9", position: "absolute", right: "0" },
    circle2: { width: "200px", height: "200px", borderRadius: "50%", backgroundColor: "#e8eaf6", position: "absolute", right: "50px", top: "150px" },
    keyIconLarge: { fontSize: "130px", position: "absolute", right: "100px", top: "180px", opacity: 0.1 }
};

export default ForgotPassword;