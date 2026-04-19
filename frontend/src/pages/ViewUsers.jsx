import React, { useEffect, useState } from "react";
import axios from "axios";

function ViewUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await axios.get("http://127.0.0.1:5000/user/all");
            if (res.data.success) {
                setUsers(res.data.users);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            {/* Header Section */}
            <div style={styles.header}>
                <div style={styles.titleGroup}>
                    <h2 style={styles.title}>User Directory</h2>
                    <span style={styles.badge}>{users.length} Total Members</span>
                </div>

            </div>

            {/* Table Section */}
            <div style={styles.tableWrapper}>
                <table style={styles.table}>
                    <thead>
                        <tr style={styles.theadRow}>
                            <th style={styles.th}>Member ID</th>
                            <th style={styles.th}>Full Name</th>
                            <th style={styles.th}>Email Address</th>
                            <th style={styles.th}>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="4" style={styles.loadingText}>Loading users...</td>
                            </tr>
                        ) : users.length > 0 ? (
                            users.map((user, index) => (
                                <tr
                                    key={user.id}
                                    style={index % 2 === 0 ? styles.trEven : styles.trOdd}
                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f1f5f9"}
                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = index % 2 === 0 ? "#ffffff" : "#fbfcfd"}
                                >
                                    <td style={styles.td}>
                                        <span style={styles.idChip}>#{user.id}</span>
                                    </td>
                                    <td style={{ ...styles.td, fontWeight: "600", color: "#1e293b" }}>
                                        {user.name}
                                    </td>
                                    <td style={styles.td}>{user.email}</td>
                                    <td style={styles.td}>
                                        <span style={user.is_active ? styles.statusActive : styles.statusInactive}>
                                            {user.is_active ? "Active" : "Inactive"}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" style={styles.noData}>No users found in the system.</td>
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
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
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
        color: "#1a237e", // Professional Blue
        margin: 0,
        fontWeight: "800",
    },
    badge: {
        backgroundColor: "#e0f2fe",
        color: "#0369a1",
        padding: "4px 12px",
        borderRadius: "20px",
        fontSize: "0.8rem",
        fontWeight: "700",
    },
    refreshBtn: {
        backgroundColor: "transparent",
        border: "1px solid #cbd5e1",
        padding: "8px 16px",
        borderRadius: "8px",
        color: "#64748b",
        fontSize: "0.85rem",
        fontWeight: "600",
        cursor: "pointer",
        transition: "0.2s",
    },
    tableWrapper: {
        backgroundColor: "#ffffff",
        borderRadius: "12px",
        overflow: "hidden",
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
    },
    table: {
        width: "100%",
        borderCollapse: "collapse",
        textAlign: "left",
    },
    theadRow: {
        backgroundColor: "#f8fafc",
        borderBottom: "2px solid #edf2f7",
    },
    th: {
        padding: "15px 20px",
        fontSize: "0.85rem",
        textTransform: "uppercase",
        letterSpacing: "0.5px",
        color: "#64748b",
        fontWeight: "700",
    },
    td: {
        padding: "15px 20px",
        fontSize: "0.95rem",
        color: "#475569",
        borderBottom: "1px solid #f1f5f9",
    },
    trEven: {
        backgroundColor: "#ffffff",
    },
    trOdd: {
        backgroundColor: "#fbfcfd",
    },
    idChip: {
        backgroundColor: "#f1f5f9",
        padding: "4px 8px",
        borderRadius: "6px",
        fontSize: "0.85rem",
        fontWeight: "600",
        color: "#1a237e",
    },
    statusActive: {
        backgroundColor: "#dcfce7",
        color: "#15803d",
        padding: "4px 10px",
        borderRadius: "12px",
        fontSize: "0.75rem",
        fontWeight: "700",
    },
    loadingText: {
        padding: "40px",
        textAlign: "center",
        color: "#94a3b8",
    },
    noData: {
        padding: "40px",
        textAlign: "center",
        color: "#94a3b8",
    },
    statusInactive: {
        backgroundColor: "#fee2e2",
        color: "#b91c1c",
        padding: "4px 10px",
        borderRadius: "12px",
        fontSize: "0.75rem",
        fontWeight: "700",
    }

};

export default ViewUsers;