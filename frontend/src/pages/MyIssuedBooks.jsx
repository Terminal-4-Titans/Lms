import React, { useEffect, useState } from "react";
import axios from "axios";

function MyIssuedBooks() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem("user_id");

  useEffect(() => {
    fetchMyBooks();
  }, []);

  const fetchMyBooks = async () => {
    try {
      const res = await axios.get(`http://127.0.0.1:5000/user/my-issued-books/${userId}`);
      if (res.data.success) {
        setBooks(res.data.books);
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
        <div style={styles.titleArea}>
          <h2 style={styles.title}>My Borrowing History</h2>
          <p style={styles.subtitle}>View issue dates, deadlines, and return status of your books.</p>
        </div>
        <div style={styles.statsBadge}>
          {books.length} Total Transactions
        </div>
      </div>

      {/* DATA TABLE */}
      <div style={styles.tableCard}>
        <div style={styles.tableScroll}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.theadRow}>
                <th style={styles.th}>ID</th>
                <th style={styles.th}>Book Title</th>
                <th style={styles.th}>Issue Date</th>
                <th style={styles.th}>Due Date</th>
                <th style={styles.th}>Returned Date</th>
                <th style={styles.th}>Status</th>
                <th style={{ ...styles.th, textAlign: "right" }}>Fine</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="7" style={styles.loadingText}>Syncing records...</td></tr>
              ) : books.length > 0 ? (
                books.map((item, index) => (
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
                    <td style={styles.td}>{item.issue_date}</td>
                    <td style={{ ...styles.td, color: item.status === 'issued' ? "#d97706" : "#64748b" }}>
                      {item.due_date}
                    </td>
                    <td style={styles.td}>
                      {item.return_date ? (
                        <span style={{color: "#059669", fontWeight: "600"}}>{item.return_date}</span>
                      ) : (
                        <span style={styles.pendingText}>Pending</span>
                      )}
                    </td>
                    <td style={styles.td}>
                      <span style={
                        item.status === 'issued' ? styles.statusIssued : 
                        item.status === 'returned' ? styles.statusReturned : styles.statusOverdue
                      }>
                        {item.status.toUpperCase()}
                      </span>
                    </td>
                    <td style={{ ...styles.td, textAlign: "right" }}>
                      <span style={item.fine > 0 ? styles.fineActive : styles.fineZero}>
                        ₹{item.fine}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" style={styles.noData}>
                    No library transaction records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    fontFamily: "'Plus Jakarta Sans', sans-serif",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "25px",
    paddingBottom: "15px",
    borderBottom: "1px solid #eef2f6",
  },
  titleArea: { flex: 1 },
  title: {
    fontSize: "1.5rem",
    color: "#3e2723", // Wood Brown matching user theme
    fontWeight: "800",
    margin: 0,
  },
  subtitle: {
    fontSize: "0.9rem",
    color: "#64748b",
    marginTop: "4px",
  },
  statsBadge: {
    backgroundColor: "#efebe9",
    color: "#5d4037",
    padding: "6px 16px",
    borderRadius: "30px",
    fontSize: "0.8rem",
    fontWeight: "700",
    border: "1px solid #d7ccc8",
  },
  tableCard: {
    backgroundColor: "white",
    borderRadius: "16px",
    overflow: "hidden",
    border: "1px solid #eef2f6",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
  },
  tableScroll: {
    overflowX: "auto",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    textAlign: "left",
    minWidth: "800px",
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
    fontSize: "0.9rem",
    color: "#475569",
    borderBottom: "1px solid #f1f5f9",
  },
  idChip: {
    fontFamily: "monospace",
    color: "#94a3b8",
    fontWeight: "600",
    backgroundColor: "#f1f5f9",
    padding: "2px 6px",
    borderRadius: "4px",
  },
  pendingText: {
    color: "#94a3b8",
    fontStyle: "italic",
    fontSize: "0.85rem",
  },
  /* STATUS BADGES */
  statusIssued: {
    backgroundColor: "#fff7ed",
    color: "#c2410c",
    padding: "5px 12px",
    borderRadius: "20px",
    fontSize: "0.75rem",
    fontWeight: "700",
    border: "1px solid #ffedd5",
  },
  statusReturned: {
    backgroundColor: "#f0fdf4",
    color: "#15803d",
    padding: "5px 12px",
    borderRadius: "20px",
    fontSize: "0.75rem",
    fontWeight: "700",
    border: "1px solid #dcfce7",
  },
  statusOverdue: {
    backgroundColor: "#fff1f2",
    color: "#e11d48",
    padding: "5px 12px",
    borderRadius: "20px",
    fontSize: "0.75rem",
    fontWeight: "700",
    border: "1px solid #fecaca",
  },
  /* FINE STYLES */
  fineActive: {
    color: "#e11d48",
    fontWeight: "800",
  },
  fineZero: {
    color: "#94a3b8",
  },
  trEven: { backgroundColor: "#ffffff" },
  trOdd: { backgroundColor: "#fbfcfd" },
  loadingText: { padding: "50px", textAlign: "center", color: "#94a3b8", fontStyle: "italic" },
  noData: { padding: "50px", textAlign: "center", color: "#64748b" }
};

export default MyIssuedBooks;