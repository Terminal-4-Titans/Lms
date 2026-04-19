import React, { useEffect, useState } from "react";
import axios from "axios";

function NotReturnedBooks() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotReturnedBooks();
  }, []);

  const fetchNotReturnedBooks = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:5000/admin/not-returned-books");
      if (res.data.success) {
        setBooks(res.data.books);
      } else {
        alert(res.data.message);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const overdueCount = books.filter(book => book.overdue).length;

  return (
    <div style={styles.container}>
      {/* HEADER & STATS BARS */}
      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>Pending Returns</h2>
          <p style={styles.subtitle}>List of resources currently in circulation that have not been returned yet.</p>
        </div>
        <div style={styles.statsRow}>
            <div style={styles.statChip}>
                <span style={styles.statLabel}>Total Pending:</span>
                <span style={styles.statValue}>{books.length}</span>
            </div>
            <div style={{...styles.statChip, backgroundColor: '#fff1f2', border: '1px solid #fecaca'}}>
                <span style={{...styles.statLabel, color: '#e11d48'}}>Overdue:</span>
                <span style={{...styles.statValue, color: '#e11d48'}}>{overdueCount}</span>
            </div>
        </div>
      </div>

      {/* DATA TABLE */}
      <div style={styles.tableCard}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.theadRow}>
              <th style={styles.th}>ID</th>
              <th style={styles.th}>Member Details</th>
              <th style={styles.th}>Book Title</th>
              <th style={styles.th}>Issue Date</th>
              <th style={styles.th}>Due Date</th>
              <th style={styles.th}>Fine (Est.)</th>
              <th style={{ ...styles.th, textAlign: "center" }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="7" style={styles.loadingText}>Loading circulation records...</td></tr>
            ) : books.length > 0 ? (
              books.map((item, index) => (
                <tr 
                  key={item.id} 
                  style={item.overdue ? styles.overdueRow : (index % 2 === 0 ? styles.trEven : styles.trOdd)}
                >
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
                  <td style={styles.td}>{item.issue_date}</td>
                  <td style={{...styles.td, fontWeight: item.overdue ? "700" : "400"}}>
                    {item.due_date}
                  </td>
                  <td style={styles.td}>₹{item.amount}</td>
                  <td style={{ ...styles.td, textAlign: "center" }}>
                    <span style={item.overdue ? styles.statusBadgeOverdue : styles.statusBadgeNormal}>
                      {item.overdue ? "Overdue ⚠️" : "Pending"}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" style={styles.noData}>No pending books found. All clear!</td>
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
    alignItems: "flex-start",
    marginBottom: "30px",
    paddingBottom: "20px",
    borderBottom: "1px solid #e2e8f0",
  },
  title: {
    fontSize: "1.5rem",
    color: "#1e293b",
    margin: 0,
    fontWeight: "800",
  },
  subtitle: {
    fontSize: "0.9rem",
    color: "#64748b",
    marginTop: "5px",
  },
  statsRow: {
    display: "flex",
    gap: "10px",
  },
  statChip: {
    padding: "8px 16px",
    backgroundColor: "#f1f5f9",
    borderRadius: "10px",
    display: "flex",
    gap: "8px",
    alignItems: "center",
    border: "1px solid #e2e8f0",
  },
  statLabel: { fontSize: "0.8rem", fontWeight: "600", color: "#64748b" },
  statValue: { fontSize: "1rem", fontWeight: "800", color: "#1a237e" },

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
  userInfo: { display: "flex", flexDirection: "column" },
  userName: { fontWeight: "700", color: "#1e293b" },
  userEmail: { fontSize: "0.8rem", color: "#94a3b8" },
  
  trEven: { backgroundColor: "#ffffff" },
  trOdd: { backgroundColor: "#fbfcfd" },
  overdueRow: { backgroundColor: "#fff1f2" }, // Very soft red for high alert rows

  idChip: {
    fontFamily: "monospace",
    color: "#94a3b8",
    fontWeight: "600",
    backgroundColor: "#f1f5f9",
    padding: "2px 6px",
    borderRadius: "4px",
  },
  statusBadgeNormal: {
    backgroundColor: "#fef3c7",
    color: "#d97706",
    padding: "5px 12px",
    borderRadius: "20px",
    fontSize: "0.75rem",
    fontWeight: "700",
    border: "1px solid #fde68a",
  },
  statusBadgeOverdue: {
    backgroundColor: "#e11d48",
    color: "white",
    padding: "5px 12px",
    borderRadius: "20px",
    fontSize: "0.75rem",
    fontWeight: "700",
    boxShadow: "0 2px 4px rgba(225, 29, 72, 0.2)",
  },
  loadingText: { padding: "40px", textAlign: "center", color: "#94a3b8" },
  noData: { padding: "40px", textAlign: "center", color: "#10b981", fontWeight: "600" }
};

export default NotReturnedBooks;