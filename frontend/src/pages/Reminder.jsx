import React, { useEffect, useState } from "react";
import axios from "axios";

function Reminder() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetchReminderBooks();
  }, []);

  const fetchReminderBooks = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:5000/admin/reminder-books");
      if (res.data.success) {
        setBooks(res.data.books);
      } else {
        alert(res.data.message);
      }
    } catch (error) {
      console.log(error);
      alert("Failed to fetch reminder data");
    } finally {
      setLoading(false);
    }
  };

  const handleSendReminder = async () => {
    setSending(true);
    try {
      const res = await axios.post("http://127.0.0.1:5000/admin/send-reminder-mails");
      alert(res.data.message);
    } catch (error) {
      console.log(error);
      alert("Failed to send reminder mails");
    } finally {
      setSending(false);
    }
  };

  return (
    <div style={styles.container}>
      {/* HEADER SECTION */}
      <div style={styles.header}>
        <div style={styles.titleGroup}>
          <h2 style={styles.title}>Impending Deadlines</h2>
          <span style={styles.badge}>Next 48 Hours</span>
        </div>

        <button
          onClick={handleSendReminder}
          style={sending ? { ...styles.reminderBtn, opacity: 0.7 } : styles.reminderBtn}
          disabled={sending}
        >
          {sending ? "Sending Notifications..." : "📧 Dispatch Bulk Reminders"}
        </button>
      </div>

      <p style={styles.subtitle}>
        Librarian notice: The following resources are due for return within the next 2 days.
      </p>

      {/* DATA TABLE */}
      <div style={styles.tableCard}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.theadRow}>
              <th style={styles.th}>Ref ID</th>
              <th style={styles.th}>Borrower Info</th>
              <th style={styles.th}>Book Details</th>
              <th style={styles.th}>Due Date</th>
              <th style={styles.th}>Security Dep.</th>
              <th style={{ ...styles.th, textAlign: "center" }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="6" style={styles.loadingText}>Syncing notification records...</td></tr>
            ) : books.length > 0 ? (
              books.map((item, index) => (
                <tr
                  key={item.id}
                  style={styles.reminderRow}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#fef3c7"}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#fffbeb"}
                >
                  <td style={styles.td}>
                    <span style={styles.idChip}>#{item.id}</span>
                  </td>
                  <td style={styles.td}>
                    <div style={styles.infoBox}>
                      <span style={styles.userName}>{item.user_name}</span>
                      <span style={styles.userEmail}>{item.user_email}</span>
                    </div>
                  </td>
                  <td style={{ ...styles.td, fontWeight: "600", color: "#1e293b" }}>
                    {item.book_title}
                  </td>
                  <td style={{ ...styles.td, color: "#d97706", fontWeight: "700" }}>
                    {item.due_date}
                  </td>
                  <td style={styles.td}>₹{item.amount}</td>
                  <td style={{ ...styles.td, textAlign: "center" }}>
                    <span style={styles.statusBadge}>Due Soon ⏳</span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" style={styles.noData}>
                  <div style={styles.emptyState}>
                    <span style={{ fontSize: '24px' }}>🔔</span>
                    <p>No books are due within the next 2 days.</p>
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
    marginBottom: "15px",
    paddingBottom: "10px",
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
  badge: {
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
    marginBottom: "25px",
    borderLeft: "4px solid #fbbf24",
    paddingLeft: "15px",
  },
  reminderBtn: {
    backgroundColor: "#1a237e", // Oxford Blue
    color: "white",
    border: "none",
    padding: "12px 24px",
    borderRadius: "10px",
    fontSize: "0.9rem",
    fontWeight: "700",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 12px rgba(26, 35, 126, 0.2)",
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
    fontSize: "0.9rem",
    color: "#475569",
    borderBottom: "1px solid #f1f5f9",
  },
  reminderRow: {
    backgroundColor: "#fffbeb", // Lite Amber background for warning items
    transition: "background-color 0.2s ease",
  },
  infoBox: { display: "flex", flexDirection: "column" },
  userName: { fontWeight: "700", color: "#1e293b" },
  userEmail: { fontSize: "0.8rem", color: "#94a3b8" },
  idChip: {
    fontFamily: "monospace",
    color: "#d97706",
    fontWeight: "600",
    backgroundColor: "rgba(251, 191, 36, 0.1)",
    padding: "4px 8px",
    borderRadius: "6px",
  },
  statusBadge: {
    backgroundColor: "#fbbf24",
    color: "#78350f",
    padding: "5px 12px",
    borderRadius: "20px",
    fontSize: "0.7rem",
    fontWeight: "800",
    letterSpacing: "0.5px",
  },
  loadingText: { padding: "40px", textAlign: "center", color: "#94a3b8", fontStyle: "italic" },
  noData: { padding: "60px", textAlign: "center" },
  emptyState: {
    color: "#10b981",
    fontWeight: "600",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    alignItems: "center"
  }
};

export default Reminder;