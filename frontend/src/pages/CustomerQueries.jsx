import React, { useEffect, useState } from "react";
import axios from "axios";

function CustomerQueries() {
  const [queries, setQueries] = useState([]);
  const [replyText, setReplyText] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQueries();
  }, []);

  const fetchQueries = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:5000/admin/all-queries");
      if (res.data.success) {
        setQueries(res.data.queries);
      }
    } catch (error) {
      console.log(error);
      alert("Failed to fetch user queries");
    } finally {
      setLoading(false);
    }
  };

  const handleReplyChange = (id, value) => {
    setReplyText({ ...replyText, [id]: value });
  };

  const handleReplySend = async (id) => {
    if (!replyText[id] || replyText[id].trim() === "") {
      alert("Please enter a reply before sending.");
      return;
    }

    try {
      const res = await axios.put(`http://127.0.0.1:5000/admin/reply-query/${id}`, {
        reply: replyText[id]
      });

      if (res.data.success) {
        alert("Reply dispatched successfully");
        fetchQueries();
      } else {
        alert(res.data.message);
      }
    } catch (error) {
      console.log(error);
      alert("System Error: Could not send reply");
    }
  };

  const pendingCount = queries.filter(q => q.status === "Pending").length;

  return (
    <div style={styles.container}>
      {/* HEADER SECTION */}
      <div style={styles.header}>
        <div style={styles.titleGroup}>
          <h2 style={styles.title}>Member Support Desk</h2>
          <span style={styles.badge}>{pendingCount} Unresolved</span>
        </div>
        <p style={styles.subtitle}>Manage and respond to member inquiries and system feedback.</p>
      </div>

      {/* DATA TABLE SECTION */}
      <div style={styles.tableCard}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.theadRow}>
              <th style={{ ...styles.th, width: "15%" }}>Sender</th>
              <th style={{ ...styles.th, width: "20%" }}>Subject</th>
              <th style={{ ...styles.th, width: "25%" }}>Message Body</th>
              <th style={{ ...styles.th, width: "10%" }}>Status</th>
              <th style={{ ...styles.th, width: "30%" }}>Resolution / Reply</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="5" style={styles.loadingText}>Connecting to support server...</td></tr>
            ) : queries.length > 0 ? (
              queries.map((q, index) => (
                <tr key={q.id} style={index % 2 === 0 ? styles.trEven : styles.trOdd}>
                  <td style={styles.td}>
                    <div style={styles.userName}>{q.user_name}</div>
                    <div style={styles.idSub}>Ticket ID: #{q.id}</div>
                  </td>
                  <td style={{ ...styles.td, fontWeight: "600", color: "#1e293b" }}>{q.subject}</td>
                  <td style={{ ...styles.td, fontSize: "0.85rem", color: "#64748b", lineHeight: "1.4" }}>
                    {q.message}
                  </td>
                  <td style={styles.td}>
                    <span style={q.status === "Pending" ? styles.statusPending : styles.statusReplied}>
                      {q.status}
                    </span>
                  </td>
                  <td style={styles.td}>
                    {q.status === "Replied" ? (
                      <div style={styles.completedReply}>
                        <span style={styles.replyIcon}>↪</span> {q.reply}
                      </div>
                    ) : (
                      <div style={styles.replyActionArea}>
                        <textarea
                          placeholder="Type your resolution here..."
                          style={styles.replyInput}
                          value={replyText[q.id] || ""}
                          onChange={(e) => handleReplyChange(q.id, e.target.value)}
                        />
                        <button
                          style={styles.sendBtn}
                          onClick={() => handleReplySend(q.id)}
                        >
                          Send Response
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={styles.noData}>
                  <div style={styles.emptyState}>
                    <span>✨</span> No inquiries found. All members are happy!
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
    tableLayout: "fixed", // Table columns consistent weights
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
    verticalAlign: "top",
    borderBottom: "1px solid #f1f5f9",
  },
  trEven: { backgroundColor: "#ffffff" },
  trOdd: { backgroundColor: "#fbfcfd" },

  userName: { fontWeight: "700", color: "#1a237e" },
  idSub: { fontSize: "0.75rem", color: "#94a3b8", marginTop: "2px" },

  statusPending: {
    backgroundColor: "#fef3c7",
    color: "#d97706",
    padding: "4px 10px",
    borderRadius: "12px",
    fontSize: "0.75rem",
    fontWeight: "700",
  },
  statusReplied: {
    backgroundColor: "#dcfce7",
    color: "#15803d",
    padding: "4px 10px",
    borderRadius: "12px",
    fontSize: "0.75rem",
    fontWeight: "700",
  },

  replyActionArea: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  replyInput: {
    width: "100%",
    minHeight: "80px",
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #e2e8f0",
    backgroundColor: "#f8fafc",
    fontSize: "0.85rem",
    fontFamily: "inherit",
    outline: "none",
    resize: "vertical",
  },
  sendBtn: {
    backgroundColor: "#1a237e",
    color: "white",
    border: "none",
    padding: "8px 16px",
    borderRadius: "6px",
    fontSize: "0.85rem",
    fontWeight: "600",
    cursor: "pointer",
    alignSelf: "flex-end",
    transition: "background 0.2s",
  },

  completedReply: {
    fontSize: "0.85rem",
    color: "#059669",
    backgroundColor: "#f0fdf4",
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #d1fae5",
    fontStyle: "italic",
    display: "flex",
    gap: "8px",
  },
  replyIcon: { fontWeight: "bold", fontSize: "1rem" },

  loadingText: { padding: "50px", textAlign: "center", color: "#94a3b8" },
  noData: { padding: "50px", textAlign: "center" },
  emptyState: { color: "#059669", fontWeight: "600" }
};

export default CustomerQueries;