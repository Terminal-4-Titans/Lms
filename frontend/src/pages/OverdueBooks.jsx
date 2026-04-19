import React, { useEffect, useState } from "react";
import axios from "axios";

function OverdueBooks() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sendingMail, setSendingMail] = useState(false);

  useEffect(() => {
    fetchOverdueBooks();
  }, []);

  const fetchOverdueBooks = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:5000/admin/not-returned-books");
      if (res.data.success) {
        const overdueOnly = res.data.books.filter((item) => item.overdue === true);
        setBooks(overdueOnly);
      } else {
        alert(res.data.message);
      }
    } catch (error) {
      console.log(error);
      alert("Failed to fetch overdue books");
    } finally {
      setLoading(false);
    }
  };

  const handleSendOverdueMail = async () => {
    setSendingMail(true);
    try {
      const res = await axios.post("http://127.0.0.1:5000/admin/send-overdue-mails");
      alert(res.data.message);
    } catch (error) {
      console.log(error);
      alert("Failed to send overdue mails");
    } finally {
      setSendingMail(false);
    }
  };

  return (
    <div style={styles.container}>
      {/* HEADER SECTION */}
      <div style={styles.header}>
        <div style={styles.titleGroup}>
          <h2 style={styles.title}>Overdue Resource Tracking</h2>
          <span style={styles.countBadge}>{books.length} Critical</span>
        </div>
        
        <button 
          onClick={handleSendOverdueMail} 
          style={sendingMail ? {...styles.mailBtn, opacity: 0.7} : styles.mailBtn}
          disabled={sendingMail}
        >
          {sendingMail ? "Sending..." : "📧 Send Bulk Reminder Mails"}
        </button>
      </div>

      <p style={styles.subtitle}>
        The following resources have exceeded their return deadline. Immediate action required.
      </p>

      {/* DATA TABLE */}
      <div style={styles.tableCard}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.theadRow}>
              <th style={styles.th}>ID</th>
              <th style={styles.th}>Member Details</th>
              <th style={styles.th}>Book Title</th>
              <th style={styles.th}>Due Date</th>
              <th style={styles.th}>Accrued Fine</th>
              <th style={{ ...styles.th, textAlign: "center" }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="6" style={styles.loadingText}>Analyzing circulation logs...</td></tr>
            ) : books.length > 0 ? (
              books.map((item) => (
                <tr key={item.id} style={styles.overdueRow}>
                  <td style={styles.td}>
                    <span style={styles.idChip}>#{item.id}</span>
                  </td>
                  <td style={styles.td}>
                    <div style={styles.userInfo}>
                      <span style={styles.userName}>{item.user_name}</span>
                      <span style={styles.userEmail}>{item.user_email}</span>
                    </div>
                  </td>
                  <td style={{ ...styles.td, fontWeight: "600", color: "#1e293b" }}>
                    {item.book_title}
                  </td>
                  <td style={{ ...styles.td, color: "#e11d48", fontWeight: "700" }}>
                    {item.due_date}
                  </td>
                  <td style={styles.td}>₹{item.amount}</td>
                  <td style={{ ...styles.td, textAlign: "center" }}>
                    <span style={styles.statusBadge}>OVERDUE ⚠️</span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" style={styles.noData}>
                  <div style={styles.emptyState}>
                    <span style={{fontSize: '30px'}}>🎉</span>
                    <p>No overdue books! All resources are returned on time.</p>
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
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "10px",
    paddingBottom: "15px",
  },
  titleGroup: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
  },
  title: {
    fontSize: "1.5rem",
    color: "#1e293b",
    margin: 0,
    fontWeight: "800",
  },
  countBadge: {
    backgroundColor: "#fff1f2",
    color: "#e11d48",
    padding: "4px 12px",
    borderRadius: "20px",
    fontSize: "0.75rem",
    fontWeight: "700",
    border: "1px solid #fecaca",
  },
  subtitle: {
    fontSize: "0.95rem",
    color: "#64748b",
    marginBottom: "25px",
    borderBottom: "1px solid #e2e8f0",
    paddingBottom: "15px",
  },
  mailBtn: {
    backgroundColor: "#2563eb", // Professional Blue
    color: "white",
    border: "none",
    padding: "12px 24px",
    borderRadius: "10px",
    fontSize: "0.9rem",
    fontWeight: "700",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 12px rgba(37, 99, 235, 0.2)",
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
  overdueRow: {
    backgroundColor: "#fff1f2", // Light red tint for all overdue items
  },
  userInfo: { display: "flex", flexDirection: "column" },
  userName: { fontWeight: "700", color: "#1e293b" },
  userEmail: { fontSize: "0.8rem", color: "#94a3b8" },
  idChip: {
    fontFamily: "monospace",
    color: "#e11d48",
    fontWeight: "600",
    backgroundColor: "rgba(225, 29, 72, 0.1)",
    padding: "4px 8px",
    borderRadius: "6px",
  },
  statusBadge: {
    backgroundColor: "#e11d48",
    color: "white",
    padding: "5px 12px",
    borderRadius: "20px",
    fontSize: "0.7rem",
    fontWeight: "800",
    letterSpacing: "0.5px",
    boxShadow: "0 2px 4px rgba(225, 29, 72, 0.2)",
  },
  loadingText: { padding: "50px", textAlign: "center", color: "#94a3b8", fontStyle: "italic" },
  noData: { padding: "60px", textAlign: "center" },
  emptyState: {
    color: "#059669",
    fontWeight: "600",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    alignItems: "center"
  }
};

export default OverdueBooks;