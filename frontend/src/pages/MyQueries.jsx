import React, { useEffect, useState } from "react";
import axios from "axios";

function MyQueries() {
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem("user_id");

  useEffect(() => {
    fetchMyQueries();
  }, []);

  const fetchMyQueries = async () => {
    try {
      const res = await axios.get(`http://127.0.0.1:5000/user/my-queries/${userId}`);
      if (res.data.success) {
        setQueries(res.data.queries);
      }
    } catch (error) {
      console.log(error);
      alert("Failed to fetch your queries");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      {/* HEADER SECTION */}
      <div style={styles.header}>
        <div style={styles.titleArea}>
          <h2 style={styles.title}>Support History</h2>
          <p style={styles.subtitle}>Track the status of your inquiries and responses from the librarian.</p>
        </div>
        <div style={styles.badge}>
          {queries.length} Total Tickets
        </div>
      </div>

      {/* QUERIES TABLE */}
      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.theadRow}>
              <th style={{ ...styles.th, width: "10%" }}>Ticket ID</th>
              <th style={{ ...styles.th, width: "25%" }}>Subject & Message</th>
              <th style={{ ...styles.th, width: "15%" }}>Status</th>
              <th style={{ ...styles.th, width: "40%" }}>Librarian's Response</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="4" style={styles.loadingText}>Loading conversation history...</td></tr>
            ) : queries.length > 0 ? (
              queries.map((q, index) => (
                <tr 
                  key={q.id} 
                  style={index % 2 === 0 ? styles.trEven : styles.trOdd}
                >
                  <td style={styles.td}>
                    <span style={styles.idChip}>#{q.id}</span>
                  </td>
                  <td style={styles.td}>
                    <div style={styles.queryContent}>
                      <span style={styles.subjectText}>{q.subject}</span>
                      <p style={styles.messageText}>{q.message}</p>
                    </div>
                  </td>
                  <td style={styles.td}>
                    <span style={q.status === 'Replied' ? styles.statusReplied : styles.statusPending}>
                      {q.status.toUpperCase()}
                    </span>
                  </td>
                  <td style={styles.td}>
                    {q.status === 'Replied' ? (
                      <div style={styles.replyBox}>
                        <span style={styles.replyIcon}>↪</span>
                        <p style={styles.replyText}>{q.reply}</p>
                      </div>
                    ) : (
                      <span style={styles.waitingText}>Waiting for response...</span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" style={styles.noData}>
                  <div style={styles.emptyState}>
                    <span style={{fontSize: '30px'}}>📩</span>
                    <p>No support queries found. If you have any issues, feel free to ask!</p>
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
    color: "#3e2723", // Wood Brown
    fontWeight: "800",
    margin: 0,
  },
  subtitle: {
    fontSize: "0.9rem",
    color: "#64748b",
    marginTop: "5px",
  },
  badge: {
    backgroundColor: "#efebe9",
    color: "#5d4037",
    padding: "6px 16px",
    borderRadius: "30px",
    fontSize: "0.8rem",
    fontWeight: "700",
    border: "1px solid #d7ccc8",
  },
  /* TABLE STYLES */
  tableWrapper: {
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
    padding: "20px 24px",
    fontSize: "0.9rem",
    verticalAlign: "top",
    borderBottom: "1px solid #f1f5f9",
  },
  idChip: {
    fontFamily: "monospace",
    color: "#94a3b8",
    fontWeight: "600",
    backgroundColor: "#f1f5f9",
    padding: "4px 8px",
    borderRadius: "6px",
  },
  /* QUERY CONTENT */
  queryContent: { display: "flex", flexDirection: "column", gap: "5px" },
  subjectText: { fontWeight: "700", color: "#1e293b", fontSize: "0.95rem" },
  messageText: { color: "#64748b", margin: 0, lineHeight: "1.5", fontSize: "0.85rem" },
  
  /* STATUS BADGES */
  statusPending: {
    backgroundColor: "#fff7ed",
    color: "#c2410c",
    padding: "4px 10px",
    borderRadius: "12px",
    fontSize: "0.7rem",
    fontWeight: "700",
    border: "1px solid #fdba74",
  },
  statusReplied: {
    backgroundColor: "#f0fdf4",
    color: "#15803d",
    padding: "4px 10px",
    borderRadius: "12px",
    fontSize: "0.7rem",
    fontWeight: "700",
    border: "1px solid #dcfce7",
  },
  
  /* REPLY SECTION */
  replyBox: {
    display: "flex",
    gap: "10px",
    backgroundColor: "#f8fafc",
    padding: "12px",
    borderRadius: "12px",
    border: "1px solid #e2e8f0",
  },
  replyIcon: { color: "#1a237e", fontWeight: "bold" },
  replyText: { color: "#1e293b", margin: 0, lineHeight: "1.5", fontSize: "0.85rem", fontWeight: "500" },
  waitingText: { color: "#94a3b8", fontStyle: "italic", fontSize: "0.85rem" },

  trEven: { backgroundColor: "#ffffff" },
  trOdd: { backgroundColor: "#fbfcfd" },
  loadingText: { padding: "50px", textAlign: "center", color: "#94a3b8" },
  noData: { padding: "50px", textAlign: "center" },
  emptyState: { color: "#64748b", display: "flex", flexDirection: "column", gap: "10px", alignItems: "center" }
};

export default MyQueries;