import React, { useEffect, useState } from "react";
import axios from "axios";

function FineDetails() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem("user_id");

  useEffect(() => {
    fetchFineDetails();
  }, []);

  const fetchFineDetails = async () => {
    try {
      const res = await axios.get(`http://127.0.0.1:5000/user/my-issued-books/${userId}`);
      if (res.data.success) {
        setBooks(res.data.books);
      }
    } catch (error) {
      console.log(error);
      alert("Failed to fetch fine data");
    } finally {
      setLoading(false);
    }
  };

  const finedBooks = books.filter((item) => Number(item.fine) > 0);
  const totalFine = finedBooks.reduce((sum, item) => sum + Number(item.fine), 0);

  return (
    <div style={styles.container}>
      {/* HEADER SECTION */}
      <div style={styles.header}>
        <div style={styles.titleArea}>
          <h2 style={styles.title}>Fine & Penalties</h2>
          <p style={styles.subtitle}>Overview of accumulated fines due to late returns or damages.</p>
        </div>
      </div>

      {/* SUMMARY CARD */}
      <div style={styles.summaryCard}>
        <div style={styles.summaryInfo}>
          <span style={styles.summaryLabel}>Total Outstanding Fine</span>
          <h1 style={styles.totalAmount}>₹{totalFine.toLocaleString('en-IN')}</h1>
        </div>
        <div style={styles.summaryIcon}>💰</div>
      </div>

      {/* TABLE SECTION */}
      <div style={styles.tableCard}>
        <div style={styles.tableHeader}>
            <h3 style={styles.tableTitle}>Penalty Breakdown</h3>
            <span style={styles.recordBadge}>{finedBooks.length} Items Listed</span>
        </div>
        
        <table style={styles.table}>
          <thead>
            <tr style={styles.theadRow}>
              <th style={styles.th}>Reference ID</th>
              <th style={styles.th}>Book Title</th>
              <th style={styles.th}>Due Date</th>
              <th style={styles.th}>Return Date</th>
              <th style={{ ...styles.th, textAlign: "right" }}>Fine Amount</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="5" style={styles.loadingText}>Loading financial records...</td></tr>
            ) : finedBooks.length > 0 ? (
              finedBooks.map((item, index) => (
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
                  <td style={styles.td}>{item.due_date}</td>
                  <td style={styles.td}>
                    <span style={styles.returnDate}>{item.return_date || "Not Returned Yet"}</span>
                  </td>
                  <td style={{ ...styles.td, textAlign: "right" }}>
                    <span style={styles.fineValue}>₹{item.fine}</span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={styles.noData}>
                  <div style={styles.successState}>
                    <span style={{fontSize: '32px'}}>🎉</span>
                    <h4 style={{margin: '10px 0 0 0', color: '#059669'}}>Perfect Status!</h4>
                    <p style={{margin: '5px 0 0 0', color: '#64748b'}}>You have no outstanding fines in your account.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div style={styles.footerNote}>
        * Please contact the library administration desk for fine payments and waivers.
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
  title: {
    fontSize: "1.5rem",
    color: "#3e2723",
    fontWeight: "800",
    margin: 0,
  },
  subtitle: {
    fontSize: "0.9rem",
    color: "#64748b",
    marginTop: "5px",
  },
  /* SUMMARY CARD */
  summaryCard: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "linear-gradient(135deg, #1a237e 0%, #3949ab 100%)",
    padding: "30px",
    borderRadius: "20px",
    color: "white",
    marginBottom: "30px",
    boxShadow: "0 10px 20px rgba(26, 35, 126, 0.15)",
  },
  summaryLabel: {
    fontSize: "0.9rem",
    fontWeight: "600",
    opacity: 0.8,
    textTransform: "uppercase",
    letterSpacing: "1px",
  },
  totalAmount: {
    fontSize: "2.5rem",
    margin: "10px 0 0 0",
    fontWeight: "800",
  },
  summaryIcon: {
    fontSize: "3rem",
    opacity: 0.2,
  },
  /* TABLE STYLES */
  tableCard: {
    backgroundColor: "white",
    borderRadius: "16px",
    overflow: "hidden",
    border: "1px solid #eef2f6",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
  },
  tableHeader: {
    padding: "20px 25px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "1px solid #f1f5f9",
  },
  tableTitle: {
    fontSize: "1.1rem",
    color: "#1e293b",
    margin: 0,
    fontWeight: "700",
  },
  recordBadge: {
    backgroundColor: "#fff1f2",
    color: "#be123c",
    padding: "4px 12px",
    borderRadius: "20px",
    fontSize: "0.75rem",
    fontWeight: "700",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    textAlign: "left",
  },
  theadRow: {
    backgroundColor: "#f8fafc",
  },
  th: {
    padding: "15px 25px",
    fontSize: "0.75rem",
    textTransform: "uppercase",
    letterSpacing: "1px",
    color: "#64748b",
    fontWeight: "700",
  },
  td: {
    padding: "18px 25px",
    fontSize: "0.9rem",
    color: "#475569",
    borderBottom: "1px solid #f1f5f9",
  },
  idChip: {
    fontFamily: "monospace",
    color: "#94a3b8",
    fontWeight: "600",
  },
  returnDate: {
    color: "#64748b",
    fontSize: "0.85rem",
  },
  fineValue: {
    color: "#e11d48", // Attention Red
    fontWeight: "800",
    fontSize: "1rem",
  },
  trEven: { backgroundColor: "#ffffff" },
  trOdd: { backgroundColor: "#fbfcfd" },
  loadingText: { padding: "40px", textAlign: "center", color: "#94a3b8" },
  noData: { padding: "50px", textAlign: "center" },
  successState: { textAlign: "center", padding: "20px" },
  footerNote: {
    marginTop: "20px",
    fontSize: "0.8rem",
    color: "#94a3b8",
    fontStyle: "italic",
  }
};

export default FineDetails;