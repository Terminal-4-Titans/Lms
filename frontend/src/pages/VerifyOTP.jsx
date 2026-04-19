import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

function VerifyOTP() {
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    // Masking the email for better professional security look
    const rawEmail = location.state?.email || "admin@example.com";
    const maskedEmail = rawEmail.replace(/^(.)(.*)(?=@)/, (gp1, gp2, gp3) => {
        return gp2 + gp3.replace(/./g, "*");
    });

    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        if (otp.length < 6) return alert("Please enter a valid 6-digit code");

        setLoading(true);
        try {
            const res = await axios.post("http://127.0.0.1:5000/admin/verify-otp", {
                email: rawEmail,
                otp: otp
            });

            if (res.data.success) {
                navigate("/admin-dashboard");
            } else {
                alert(res.data.message);
            }
        } catch (error) {
            console.error(error);
            alert("Verification Failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.pageWrapper}>
            {/* Header / Brand */}
            <div style={styles.navHeader}>
                <div style={styles.brand}>LibSource <span style={styles.brandAdmin}>Security</span></div>
            </div>

            <div style={styles.contentBody}>
                <div style={styles.card}>
                    {/* Security Icon */}
                    <div style={styles.iconContainer}>
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#1a237e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                        </svg>
                    </div>

                    <h2 style={styles.title}>Account Verification</h2>
                    <p style={styles.description}>
                        A 6-digit verification code has been sent to the registered email address:
                        <br />
                        <span style={styles.emailText}>{maskedEmail}</span>
                    </p>

                    <form onSubmit={handleVerifyOTP} style={styles.form}>
                        <div style={styles.inputArea}>
                            <label style={styles.label}>Authentication Code</label>
                            <input
                                type="text"
                                placeholder="000000"
                                maxLength="6"
                                style={styles.otpInput}
                                value={otp}
                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            style={loading ? { ...styles.submitBtn, opacity: 0.7 } : styles.submitBtn}
                            disabled={loading}
                        >
                            {loading ? "Verifying..." : "Confirm & Access Dashboard"}
                        </button>
                    </form>

                    <div style={styles.footerLinks}>
                        <button onClick={() => navigate("/admin-login")} style={styles.secondaryBtn}>
                            Use another email
                        </button>
                        <div style={styles.divider}></div>
                        <button style={styles.secondaryBtn}>
                            Resend Code
                        </button>
                    </div>
                </div>
                <p style={styles.legalText}>© {new Date().getFullYear()} Library Resource Management System. Authorized personnel only.</p>
            </div>
        </div>
    );
}

const styles = {
    pageWrapper: {
        height: "100vh",
        width: "100vw",
        backgroundColor: "#f4f7f9", // Light professional grey-blue
        fontFamily: "'Inter', -apple-system, sans-serif",
        display: "flex",
        flexDirection: "column",
    },
    navHeader: {
        padding: "20px 50px",
        backgroundColor: "#ffffff",
        borderBottom: "1px solid #e1e8ed",
    },
    brand: {
        fontSize: "1.2rem",
        fontWeight: "800",
        color: "#1a237e",
        letterSpacing: "-0.5px",
    },
    brandAdmin: {
        color: "#546e7a",
        fontWeight: "400",
        fontSize: "0.9rem",
    },
    contentBody: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
    },
    card: {
        backgroundColor: "#ffffff",
        width: "100%",
        maxWidth: "440px",
        padding: "40px",
        borderRadius: "12px",
        boxShadow: "0 10px 25px rgba(0, 0, 0, 0.05)",
        border: "1px solid #e1e8ed",
        textAlign: "center",
    },
    iconContainer: {
        width: "60px",
        height: "60px",
        backgroundColor: "#f0f2f5",
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        margin: "0 auto 20px auto",
    },
    title: {
        fontSize: "1.5rem",
        color: "#1e293b",
        fontWeight: "700",
        margin: "0 0 10px 0",
    },
    description: {
        fontSize: "0.95rem",
        color: "#64748b",
        lineHeight: "1.6",
        marginBottom: "30px",
    },
    emailText: {
        color: "#1a237e",
        fontWeight: "600",
    },
    form: {
        textAlign: "left",
    },
    inputArea: {
        marginBottom: "25px",
    },
    label: {
        display: "block",
        fontSize: "0.8rem",
        fontWeight: "600",
        color: "#475569",
        textTransform: "uppercase",
        letterSpacing: "0.5px",
        marginBottom: "10px",
    },
    otpInput: {
        width: "100%",
        padding: "15px",
        borderRadius: "8px",
        border: "2px solid #e2e8f0",
        fontSize: "1.8rem",
        textAlign: "center",
        letterSpacing: "12px",
        fontWeight: "600",
        color: "#1e293b",
        outline: "none",
        transition: "border-color 0.2s",
        boxSizing: "border-box",
    },
    submitBtn: {
        width: "100%",
        padding: "15px",
        backgroundColor: "#1a237e",
        color: "#ffffff",
        border: "none",
        borderRadius: "8px",
        fontSize: "1rem",
        fontWeight: "600",
        cursor: "pointer",
        transition: "background 0.2s",
    },
    footerLinks: {
        marginTop: "30px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "15px",
    },
    divider: {
        width: "1px",
        height: "15px",
        backgroundColor: "#cbd5e1",
    },
    secondaryBtn: {
        background: "none",
        border: "none",
        color: "#64748b",
        fontSize: "0.85rem",
        fontWeight: "500",
        cursor: "pointer",
        textDecoration: "underline",
    },
    legalText: {
        marginTop: "30px",
        fontSize: "0.8rem",
        color: "#94a3b8",
    }
};

export default VerifyOTP;