import React, { useEffect, useState } from "react";
import axios from "axios";

function UserReminder() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem("user_id");

  useEffect(() => {
    fetchReminder();
  }, []);

  const fetchReminder = async () => {
    try {
      const res = await axios.get(`http://127.0.0.1:5000/user/my-issued-books/${userId}`);
      if (res.data.success) {
        const today = new Date();
        const twoDaysLater = new Date();
        twoDaysLater.setDate(today.getDate() + 2);

        const filtered = res.data.books.filter((item) => {
          // Check for both 'issued' and 'Issued' casing
          if (item.status.toLowerCase() !== "issued") return false;

          const due = new Date(item.due_date);
          // Return books due between now and next 2 days
          return due <= twoDaysLater;
        });

        setBooks(filtered);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      {/* HEADER SECTION */}
      <div style={styles.header}>
        <div style={styles.titleGroup}>
          <h2 style={styles.title}>Due Date Alerts</h2>
          <span style={styles.alertBadge}>Next 48 Hours</span>
        </div>
        <p style={styles.subtitle}>Important reminders for books reaching their return deadline.</p>
      </div>

      {/* REMINDER CONTENT */}
      <div style={styles.contentWrapper}>
        {loading ? (
          <div style={styles.loadingArea}>Checking deadlines...</div>
        ) : books.length > 0 ? (
          <div style={styles.tableCard}>
            <table style={styles.table}>
              <thead>
                <tr style={styles.theadRow}>
                  <th style={styles.th}>Reference ID</th>
                  <th style={styles.th}>Resource Title</th>
                  <th style={styles.th}>Deadline (Due Date)</th>
                  <th style={{ ...styles.th, textAlign: "center" }}>Action Status</th>
                </tr>
              </thead>
              <tbody>
                {books.map((item, index) => (
                  <tr 
                    key={item.id} 
                    style={index % 2 === 0 ? styles.trEven : styles.trOdd}
                  >
                    <td style={styles.td}>
                      <span style={styles.idChip}>#{item.id}</span>
                    </td>
                    <td style={{ ...styles.td, fontWeight: "700", color: "#1e293b" }}>
                      {item.book_title}
                    </td>
                    <td style={styles.td}>
                      <div style={styles.dueHighlight}>
                        <span style={styles.clockIcon}>⏰</span> {item.due_date}
                      </div>
                    </td>
                    <td style={{ ...styles.td, textAlign: "center" }}>
                      <span style={styles.statusBadge}>RETURN SOON</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={styles.infoFooter}>
              💡 Please return the books on time to avoid fine accumulation.
            </div>
          </div>
        ) : (
          /* EMPTY STATE */
          <div style={styles.emptyCard}>
            <div style={styles.emptyIcon}>🎉</div>
            <h3 style={styles.emptyTitle}>You're all caught up!</h3>
            <p style={styles.emptyText}>No books are due for return in the next 2 days.</p>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    fontFamily: "'Plus Jakarta Sans', sans-serif",
  },
  header: {
    marginBottom: "25px",
    paddingBottom: "15px",
    borderBottom: "1px solid #eef2f6",
  },
  titleGroup: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
  },
  title: {
    fontSize: "1.5rem",
    color: "#3e2723", // Wood Brown
    fontWeight: "800",
    margin: 0,
  },
  alertBadge: {
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
  /* TABLE STYLES */
  tableCard: {
    backgroundColor: "white",
    borderRadius: "16px",
    overflow: "hidden",
    border: "1px solid #eef2f6",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
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
    fontSize: "0.75rem",
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
  trEven: { backgroundColor: "#ffffff" },
  trOdd: { backgroundColor: "#fffbeb" }, // Lite amber row
  idChip: {
    fontFamily: "monospace",
    color: "#94a3b8",
    fontWeight: "600",
  },
  dueHighlight: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    color: "#c2410c",
    fontWeight: "700",
  },
  statusBadge: {
    backgroundColor: "#f59e0b",
    color: "white",
    padding: "5px 12px",
    borderRadius: "20px",
    fontSize: "0.7rem",
    fontWeight: "800",
    letterSpacing: "0.5px",
  },
  infoFooter: {
    padding: "15px",
    backgroundColor: "#f8fafc",
    textAlign: "center",
    fontSize: "0.85rem",
    color: "#64748b",
    fontWeight: "500",
  },
  /* EMPTY STATE STYLES */
  emptyCard: {
    textAlign: "center",
    padding: "60px 20px",
    backgroundColor: "white",
    borderRadius: "20px",
    border: "1px solid #eef2f6",
    marginTop: "20px",
  },
  emptyIcon: {
    fontSize: "50px",
    marginBottom: "20px",
  },
  emptyTitle: {
    color: "#10b981", // Success Green
    margin: "0 0 10px 0",
    fontSize: "1.4rem",
  },
  emptyText: {
    color: "#64748b",
    margin: 0,
    fontSize: "1rem",
  },
  loadingArea: {
    textAlign: "center",
    padding: "40px",
    color: "#94a3b8",
    fontStyle: "italic",
  }
};

export default UserReminder;