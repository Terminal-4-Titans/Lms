import React, { useEffect, useState } from "react";
import axios from "axios";

function DeleteUser() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:5000/user/active")
      if (res.data.success) {
        setUsers(res.data.users);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    // Professional confirmation dialog
    const confirmDelete = window.confirm(`Are you sure you want to permanently delete user: ${name}?`);

    if (confirmDelete) {
      try {
        const res = await axios.delete(`http://127.0.0.1:5000/user/delete/${id}`);

        if (res.data.success) {
          alert("User deleted successfully");
          fetchUsers(); // Refresh the list after deletion
        } else {
          alert(res.data.message);
        }
      } catch (error) {
        console.log(error);
        alert("Failed to delete user");
      }
    }
  };

  return (
    <div style={styles.container}>
      {/* HEADER SECTION */}
      <div style={styles.header}>
        <div style={styles.titleGroup}>
          <h2 style={styles.title}>Manage Account Deletion</h2>
          <span style={styles.warningBadge}>⚠️ Sensitive Action</span>
        </div>
        <p style={styles.subtitle}>List of all registered members. Use caution when deleting accounts.</p>
      </div>

      {/* DATA TABLE */}
      <div style={styles.tableCard}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.theadRow}>
              <th style={styles.th}>ID</th>
              <th style={styles.th}>Full Name</th>
              <th style={styles.th}>Email Address</th>
              <th style={{ ...styles.th, textAlign: "right" }}>Management</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="4" style={styles.loadingText}>Fetching user records...</td>
              </tr>
            ) : users.length > 0 ? (
              users.map((user, index) => (
                <tr
                  key={user.id}
                  style={index % 2 === 0 ? styles.trEven : styles.trOdd}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#fff1f2"}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = index % 2 === 0 ? "#ffffff" : "#fbfcfd"}
                >
                  <td style={styles.td}>
                    <span style={styles.idChip}>#{user.id}</span>
                  </td>
                  <td style={styles.userName}>{user.name}</td>
                  <td style={styles.td}>{user.email}</td>
                  <td style={{ ...styles.td, textAlign: "right" }}>
                    <button
                      style={styles.deleteBtn}
                      onClick={() => handleDelete(user.id, user.name)}
                    >
                      Delete Account
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" style={styles.noData}>No user records found.</td>
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
    marginBottom: "30px",
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
    color: "#1e293b",
    margin: 0,
    fontWeight: "800",
  },
  warningBadge: {
    backgroundColor: "#fff1f2",
    color: "#e11d48",
    padding: "4px 12px",
    borderRadius: "20px",
    fontSize: "0.75rem",
    fontWeight: "700",
    border: "1px solid #fecaca",
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
  deleteBtn: {
    backgroundColor: "#e11d48", // Professional Rose Red
    color: "white",
    border: "none",
    padding: "8px 16px",
    borderRadius: "8px",
    fontSize: "0.85rem",
    fontWeight: "700",
    cursor: "pointer",
    transition: "0.2s",
    boxShadow: "0 2px 4px rgba(225, 29, 72, 0.1)",
  },
  loadingText: {
    padding: "40px",
    textAlign: "center",
    color: "#94a3b8",
    fontStyle: "italic",
  },
  noData: {
    padding: "40px",
    textAlign: "center",
    color: "#94a3b8",
  }
};

export default DeleteUser;