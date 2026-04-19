import React, { useEffect, useState } from "react";
import axios from "axios";

function InactiveUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await axios.get("http://127.0.0.1:5000/user/inactive");
            if (res.data.success) {
                setUsers(res.data.users);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const handleActivate = async (id, name) => {
        try {
            const res = await axios.put(`http://127.0.0.1:5000/user/activate/${id}`);

            if (res.data.success) {
                alert(`Account for ${name} activated successfully!`);
                fetchUsers();
            } else {
                alert(res.data.message);
            }
        } catch (error) {
            console.log(error);
            alert(error.response?.data?.message || "Failed to activate user");
        }
    };

    return (
        <div style={styles.container}>
            {/* HEADER SECTION */}
            <div style={styles.header}>
                <div style={styles.titleGroup}>
                    <h2 style={styles.title}>Pending Approvals</h2>
                    <span style={styles.countBadge}>{users.length} Inactive</span>
                </div>
                <p style={styles.subtitle}>List of users waiting for system access activation.</p>
            </div>

            {/* TABLE SECTION */}
            <div style={styles.tableCard}>
                <table style={styles.table}>
                    <thead>
                        <tr style={styles.theadRow}>
                            <th style={styles.th}>Member ID</th>
                            <th style={styles.th}>User Info</th>
                            <th style={styles.th}>Email Address</th>
                            <th style={styles.th}>Status</th>
                            <th style={{ ...styles.th, textAlign: "right" }}>Management</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="5" style={styles.loadingText}>Searching records...</td>
                            </tr>
                        ) : users.length > 0 ? (
                            users.map((u, index) => (
                                <tr
                                    key={u.id}
                                    style={index % 2 === 0 ? styles.trEven : styles.trOdd}
                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f0fdf4"}
                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = index % 2 === 0 ? "#ffffff" : "#fbfcfd"}
                                >
                                    <td style={styles.td}>
                                        <span style={styles.idChip}>#{u.id}</span>
                                    </td>
                                    <td style={styles.userName}>{u.name}</td>
                                    <td style={styles.td}>{u.email}</td>
                                    <td style={styles.td}>
                                        <span style={styles.inactiveLabel}>Pending</span>
                                    </td>
                                    <td style={{ ...styles.td, textAlign: "right" }}>
                                        <button
                                            style={styles.activateBtn}
                                            onClick={() => handleActivate(u.id, u.name)}
                                        >
                                            Activate User
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" style={styles.noData}>
                                    <div style={styles.emptyState}>
                                        <span style={{ fontSize: '24px' }}>✅</span>
                                        <p>All users are currently active.</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

const styles = {
    container: {
        padding: "10px",
        fontFamily: "'Inter', sans-serif",
    },
    header: {
        marginBottom: "25px",
        paddingBottom: "15px",
        borderBottom: "1px solid #e2e8f0",
    },
    titleGroup: {
        display: "flex",
        alignItems: "center",
        gap: "15px",
    },
    title: {
        fontSize: "1.4rem",
        color: "#1a237e",
        margin: 0,
        fontWeight: "800",
    },
    countBadge: {
        backgroundColor: "#fff7ed",
        color: "#c2410c",
        padding: "4px 12px",
        borderRadius: "20px",
        fontSize: "0.75rem",
        fontWeight: "700",
        border: "1px solid #fdba74",
    },
    subtitle: {
        fontSize: "0.9rem",
        color: "#64748b",
        marginTop: "5px",
    },
    tableCard: {
        backgroundColor: "white",
        borderRadius: "16px",
        overflow: "hidden",
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
        border: "1px solid #e2e8f0",
    },
    table: {
        width: "100%",
        borderCollapse: "collapse",
        textAlign: "left",
    },
    theadRow: {
        backgroundColor: "#f8fafc",
        borderBottom: "2px solid #f1f5f9",
    },
    th: {
        padding: "18px 24px",
        fontSize: "0.8rem",
        textTransform: "uppercase",
        letterSpacing: "1px",
        color: "#64748b",
        fontWeight: "700",
    },
    td: {
        padding: "18px 24px",
        fontSize: "0.95rem",
        color: "#475569",
        borderBottom: "1px solid #f1f5f9",
    },
    userName: {
        padding: "18px 24px",
        fontSize: "0.95rem",
        color: "#1e293b",
        fontWeight: "600",
        borderBottom: "1px solid #f1f5f9",
    },
    trEven: { backgroundColor: "#ffffff" },
    trOdd: { backgroundColor: "#fbfcfd" },
    idChip: {
        fontFamily: "monospace",
        color: "#94a3b8",
        fontWeight: "600",
    },
    inactiveLabel: {
        backgroundColor: "#fef3c7",
        color: "#d97706",
        padding: "4px 10px",
        borderRadius: "12px",
        fontSize: "0.75rem",
        fontWeight: "700",
    },
    activateBtn: {
        backgroundColor: "#059669", // Success Green
        color: "white",
        border: "none",
        padding: "8px 16px",
        borderRadius: "8px",
        fontSize: "0.85rem",
        fontWeight: "700",
        cursor: "pointer",
        transition: "all 0.2s ease",
        boxShadow: "0 2px 4px rgba(5, 150, 105, 0.1)",
    },
    loadingText: {
        padding: "50px",
        textAlign: "center",
        color: "#94a3b8",
        fontStyle: "italic",
    },
    noData: {
        padding: "50px",
        textAlign: "center",
    },
    emptyState: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "10px",
        color: "#059669",
        fontWeight: "500",
    }
};

export default InactiveUsers;