import React, { useEffect, useState } from "react";
import axios from "axios";

function AllReturnedBooks() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReturnedBooks();
  }, []);

  const fetchReturnedBooks = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:5000/admin/returned-books");
      if (res.data.success) {
        setBooks(res.data.books);
      } else {
        alert(res.data.message);
      }
    } catch (error) {
      console.log(error);
      alert("Failed to fetch returned books archive");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      {/* HEADER SECTION */}
      <div style={styles.header}>
        <div style={styles.titleGroup}>
          <h2 style={styles.title}>Circulation History</h2>
          <span style={styles.countBadge}>{books.length} Records</span>
        </div>
        <p style={styles.subtitle}>Complete archive of all resources returned to the library collection.</p>
      </div>

      {/* DATA TABLE */}
      <div style={styles.tableCard}>
        <div style={styles.tableScroll}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.theadRow}>
                <th style={styles.th}>Ref ID</th>
                <th style={styles.th}>Member Details</th>
                <th style={styles.th}>Book Information</th>
                <th style={styles.th}>Dates (Issue/Due)</th>
                <th style={styles.th}>Return Date</th>
                <th style={styles.th}>Fine Paid</th>
                <th style={{ ...styles.th, textAlign: "center" }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="7" style={styles.loadingText}>Synchronizing archive records...</td></tr>
              ) : books.length > 0 ? (
                books.map((item, index) => (
                  <tr
                    key={item.id}
                    style={index % 2 === 0 ? styles.trEven : styles.trOdd}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f0fdf4"}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = index % 2 === 0 ? "#ffffff" : "#fbfcfd"}
                  >
                    <td style={styles.td}>
                      <span style={styles.idChip}>#{item.id}</span>
                    </td>
                    <td style={styles.td}>
                      <div style={styles.infoCol}>
                        <span style={styles.primaryText}>{item.user_name}</span>
                        <span style={styles.secondaryText}>{item.user_email}</span>
                      </div>
                    </td>
                    <td style={styles.td}>
                      <div style={styles.infoCol}>
                        <span style={styles.primaryText}>{item.book_title}</span>
                        <span style={styles.secondaryText}>Charge: ₹{item.amount}</span>
                      </div>
                    </td>
                    <td style={styles.td}>
                      <div style={styles.infoCol}>
                        <span style={styles.dateText}>I: {item.issue_date}</span>
                        <span style={styles.dateText}>D: {item.due_date}</span>
                      </div>
                    </td>
                    <td style={{ ...styles.td, color: "#1a237e", fontWeight: "700" }}>
                      {item.return_date}
                    </td>
                    <td style={styles.td}>
                      <span style={item.fine > 0 ? styles.fineBadge : styles.noFineText}>
                        {item.fine > 0 ? `₹${item.fine}` : "Nil"}
                      </span>
                    </td>
                    <td style={{ ...styles.td, textAlign: "center" }}>
                      <span style={styles.statusBadge}>Completed ✅</span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" style={styles.noData}>No transaction records found in the archive.</td>
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
    fontSize: "1.5rem",
    color: "#1e293b",
    margin: 0,
    fontWeight: "800",
  },
  countBadge: {
    backgroundColor: "#ecfdf5",
    color: "#059669",
    padding: "4px 12px",
    borderRadius: "20px",
    fontSize: "0.75rem",
    fontWeight: "700",
    border: "1px solid #d1fae5",
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
  tableScroll: {
    overflowX: "auto",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    textAlign: "left",
    minWidth: "900px",
  },
  theadRow: {
    backgroundColor: "#f8fafc",
    borderBottom: "2px solid #f1f5f9",
  },
  th: {
    padding: "18px 20px",
    fontSize: "0.75rem",
    textTransform: "uppercase",
    letterSpacing: "1px",
    color: "#64748b",
    fontWeight: "700",
  },
  td: {
    padding: "15px 20px",
    fontSize: "0.9rem",
    color: "#475569",
    borderBottom: "1px solid #f1f5f9",
  },
  trEven: { backgroundColor: "#ffffff" },
  trOdd: { backgroundColor: "#fbfcfd" },

  infoCol: { display: "flex", flexDirection: "column", gap: "2px" },
  primaryText: { fontWeight: "700", color: "#1e293b" },
  secondaryText: { fontSize: "0.8rem", color: "#94a3b8" },
  dateText: { fontSize: "0.8rem", fontFamily: "monospace" },

  idChip: {
    fontFamily: "monospace",
    color: "#94a3b8",
    fontWeight: "600",
    backgroundColor: "#f1f5f9",
    padding: "2px 6px",
    borderRadius: "4px",
  },
  fineBadge: {
    backgroundColor: "#fff7ed",
    color: "#c2410c",
    padding: "4px 10px",
    borderRadius: "6px",
    fontWeight: "700",
    border: "1px solid #ffedd5",
  },
  noFineText: {
    color: "#94a3b8",
    fontSize: "0.85rem",
  },
  statusBadge: {
    backgroundColor: "#f0fdf4",
    color: "#15803d",
    padding: "5px 12px",
    borderRadius: "20px",
    fontSize: "0.75rem",
    fontWeight: "700",
  },
  loadingText: { padding: "40px", textAlign: "center", color: "#94a3b8", fontStyle: "italic" },
  noData: { padding: "40px", textAlign: "center", color: "#94a3b8" }
};

export default AllReturnedBooks;