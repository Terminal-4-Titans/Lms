import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
    const navigate = useNavigate();
    const [currentDate, setCurrentDate] = useState("");

    // Live Date logic to make the header look active/official
    useEffect(() => {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        setCurrentDate(new Date().toLocaleDateString(undefined, options));
    }, []);

    // Library related Icons (SVG)
    const IconLibrary = () => (
        <svg width="45" height="45" viewBox="0 0 24 24" fill="none" stroke="#5d4037" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 22h20"></path><path d="M4 22V7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v15"></path><path d="m9 18 3-3 3 3"></path><path d="m9 15 3-3 3 3"></path></svg>
    );

    const IconAdmin = () => (
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
    );

    const IconUser = () => (
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
    );

    return (
        <div style={styles.pageWrapper}>
            {/* IMPROVED HEADER DESIGN */}
            <nav style={styles.navbar}>
                <div style={styles.navContainer}>
                    <div style={styles.logoGroup}>
                        <div style={styles.logoCircle}>
                            <IconLibrary />
                        </div>
                        <div style={styles.brandInfo}>
                            <h1 style={styles.logoText}>LibSource</h1>
                            <span style={styles.tagline}>Smart Resource Management</span>
                        </div>
                    </div>

                    <div style={styles.dateDisplay}>
                        <span style={styles.livePulse}></span> {currentDate}
                    </div>
                </div>
            </nav>

            {/* Main Hero Section */}
            <main style={styles.mainContent}>
                <div style={styles.heroSection}>
                    <h2 style={styles.heroTitle}>Streamline Your Library Experience</h2>
                    <p style={styles.heroSubtitle}>
                        A complete digital ecosystem for modern libraries.
                        Efficiently manage books, track circulation, and engage with your knowledge base.
                    </p>
                </div>

                <div style={styles.cardGrid}>
                    {/* Admin Access Card */}
                    <div style={styles.actionCard}>
                        <div style={{ ...styles.iconWrapper, backgroundColor: '#e3f2fd' }}>
                            <IconAdmin />
                        </div>
                        <h3 style={styles.cardTitle}>Librarian Portal</h3>
                        <p style={styles.cardDescription}>
                            Admin dashboard for inventory control, member management, and advanced reporting.
                        </p>
                        <button
                            style={styles.adminBtn}
                            onClick={() => navigate("/admin-login")}
                        >
                            Admin Login
                        </button>
                    </div>

                    {/* User Access Card */}
                    <div style={styles.actionCard}>
                        <div style={{ ...styles.iconWrapper, backgroundColor: '#efebe9' }}>
                            <IconUser />
                        </div>
                        <h3 style={styles.cardTitle}>Member Access</h3>
                        <p style={styles.cardDescription}>
                            Member portal to browse the catalog, check history, and manage active loans.
                        </p>
                        <button
                            style={styles.userBtn}
                            onClick={() => navigate("/user-login")}
                        >
                            User Login
                        </button>
                    </div>
                </div>
            </main>

            <footer style={styles.footer}>
                <p>© {new Date().getFullYear()} Library Resource Management System. All Rights Reserved.</p>
            </footer>
        </div>
    );
}

const styles = {
    pageWrapper: {
        minHeight: "100vh",
        backgroundColor: "#fcfaf7",
        display: "flex",
        flexDirection: "column",
        fontFamily: "'Inter', 'Segoe UI', sans-serif",
    },
    // NEW HEADER STYLES
    navbar: {
        padding: "15px 0",
        backgroundColor: "white",
        boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
        borderBottom: "3px solid #1a237e", // Professional Blue accent line
    },
    navContainer: {
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "0 40px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
    },
    logoGroup: {
        display: "flex",
        alignItems: "center",
        gap: "18px",
    },
    logoCircle: {
        background: "#fdf5e6",
        width: "65px",
        height: "65px",
        borderRadius: "14px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        border: "1px solid #e0e0e0",
    },
    brandInfo: {
        display: "flex",
        flexDirection: "column",
    },
    logoText: {
        fontSize: "1.8rem",
        color: "#1a237e", // Oxford Blue
        fontWeight: "900",
        margin: 0,
        letterSpacing: "-0.5px",
    },
    tagline: {
        fontSize: "0.85rem",
        color: "#795548", // Wood Brown
        fontWeight: "600",
        textTransform: "uppercase",
        letterSpacing: "1px",
        marginTop: "-3px",
    },
    dateDisplay: {
        display: "flex",
        alignItems: "center",
        gap: "10px",
        color: "#546e7a",
        fontSize: "0.9rem",
        fontWeight: "500",
        background: "#f8f9fa",
        padding: "8px 16px",
        borderRadius: "30px",
        border: "1px solid #eceff1",
    },
    livePulse: {
        width: "8px",
        height: "8px",
        backgroundColor: "#4caf50",
        borderRadius: "50%",
        boxShadow: "0 0 8px #4caf50",
    },
    // OTHER SECTIONS
    mainContent: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "60px 20px",
    },
    heroSection: {
        textAlign: "center",
        maxWidth: "850px",
        marginBottom: "60px",
    },
    heroTitle: {
        fontSize: "3.2rem",
        color: "#263238",
        marginBottom: "20px",
        fontWeight: "800",
        letterSpacing: "-1px",
    },
    heroSubtitle: {
        fontSize: "1.2rem",
        color: "#607d8b",
        lineHeight: "1.6",
        fontWeight: "400",
    },
    cardGrid: {
        display: "flex",
        gap: "40px",
        flexWrap: "wrap",
        justifyContent: "center",
    },
    actionCard: {
        backgroundColor: "white",
        width: "350px",
        padding: "50px 40px",
        borderRadius: "24px",
        textAlign: "center",
        boxShadow: "0 15px 40px rgba(0,0,0,0.05)",
        border: "1px solid #f1f1f1",
        transition: "all 0.3s ease",
    },
    iconWrapper: {
        width: "70px",
        height: "70px",
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        margin: "0 auto 25px auto",
        color: "#5d4037",
    },
    cardTitle: {
        fontSize: "1.6rem",
        color: "#1a237e",
        marginBottom: "15px",
        fontWeight: "700",
    },
    cardDescription: {
        fontSize: "1rem",
        color: "#78909c",
        lineHeight: "1.6",
        marginBottom: "30px",
        minHeight: "75px",
    },
    adminBtn: {
        width: "100%",
        padding: "15px",
        backgroundColor: "#1a237e",
        color: "white",
        border: "none",
        borderRadius: "12px",
        fontSize: "1rem",
        fontWeight: "700",
        cursor: "pointer",
        transition: "transform 0.2s, background 0.2s",
        boxShadow: "0 10px 20px rgba(26, 35, 126, 0.2)",
    },
    userBtn: {
        width: "100%",
        padding: "15px",
        backgroundColor: "#5d4037",
        color: "white",
        border: "none",
        borderRadius: "12px",
        fontSize: "1rem",
        fontWeight: "700",
        cursor: "pointer",
        transition: "transform 0.2s, background 0.2s",
        boxShadow: "0 10px 20px rgba(93, 64, 55, 0.2)",
    },
    footer: {
        padding: "40px",
        textAlign: "center",
        color: "#b0bec5",
        fontSize: "0.9rem",
        backgroundColor: "#f8f9fa",
        borderTop: "1px solid #eee",
    }
};

export default Home;