import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AdminLogin() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await axios.post("http://127.0.0.1:5000/admin/login", {
                email: email,
                password: password
            });

            if (res.data.success) {
                alert("OTP sent to your email");
                navigate("/verify-otp", { state: { email: email } });
            } else {
                alert(res.data.message);
            }
        } catch (error) {
            console.error(error);
            alert("Server Error");
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
                        The only thing that you absolutely have to know, 
                        is the location of the library.
                    </p>
                    <span style={styles.quoteAuthor}>— Albert Einstein</span>
                </div>
            </div>

            {/* LOGIN CARD */}
            <div style={styles.loginCard}>
                <button style={styles.backBtn} onClick={() => navigate("/")}>
                    ← Back
                </button>
                
                <div style={styles.headerSection}>
                    <div style={styles.iconCircle}>
                        <svg width="35" height="35" viewBox="0 0 24 24" fill="none" stroke="#1a237e" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                    </div>
                    <h2 style={styles.title}>Admin Login</h2>
                    <p style={styles.subtitle}>Administrative Access Portal</p>
                </div>

                <form onSubmit={handleLogin} style={styles.form}>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Email</label>
                        <input
                            type="email"
                            placeholder="admin@libsource.com"
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

                    <button 
                        type="submit" 
                        style={loading ? {...styles.submitBtn, opacity: 0.7} : styles.submitBtn}
                        disabled={loading}
                    >
                        {loading ? "Verifying..." : "Login to System"}
                    </button>
                </form>
            </div>

            {/* RIGHT SIDE DECORATION (Abstract Shapes) */}
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
    // LEFT DECORATION
    leftDecor: {
        position: "absolute",
        left: "5%",
        maxWidth: "250px",
        display: "flex",
        flexDirection: "column",
        opacity: 0.6,
        zIndex: 0,
        "@media (max-width: 900px)": { display: "none" }, // Hide on mobile
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
        backgroundColor: "#e3f2fd",
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
    },
    // LOGIN CARD
    loginCard: {
        backgroundColor: "white",
        width: "100%",
        maxWidth: "400px",
        padding: "40px",
        borderRadius: "24px",
        boxShadow: "0 20px 50px rgba(0,0,0,0.08)",
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
        fontSize: "0.9rem",
        fontWeight: "600",
    },
    headerSection: {
        textAlign: "center",
        marginBottom: "30px",
    },
    iconCircle: {
        width: "60px",
        height: "60px",
        backgroundColor: "#f5f6fa",
        borderRadius: "15px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        margin: "10px auto 20px auto",
    },
    title: {
        fontSize: "1.6rem",
        color: "#1a237e",
        fontWeight: "800",
        margin: "0",
    },
    subtitle: {
        fontSize: "0.9rem",
        color: "#90a4ae",
        marginTop: "5px",
    },
    form: {
        display: "flex",
        flexDirection: "column",
        gap: "18px",
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
        border: "1px solid #e0e0e0",
        backgroundColor: "#fcfcfc",
        fontSize: "1rem",
        outline: "none",
        transition: "border-color 0.2s",
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
        boxShadow: "0 10px 20px rgba(26, 35, 126, 0.2)",
    }
};

export default AdminLogin;