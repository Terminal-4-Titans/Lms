import React, { useState } from "react";
import axios from "axios";

function UserQuery() {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const userId = localStorage.getItem("user_id");

  const handleSendQuery = async () => {
    if (!subject || !message) {
      alert("Please fill in both the subject and your message.");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post("http://127.0.0.1:5000/user/send-query", {
        user_id: userId,
        subject: subject,
        message: message
      });

      alert(res.data.message);

      if (res.data.success) {
        setSubject("");
        setMessage("");
      }
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Failed to send query");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      {/* HEADER SECTION */}
      <div style={styles.header}>
        <div style={styles.iconCircle}>💬</div>
        <div style={styles.titleArea}>
          <h2 style={styles.title}>Contact Librarian</h2>
          <p style={styles.subtitle}>Have a question or facing an issue? Send us a message and we'll get back to you.</p>
        </div>
      </div>

      {/* FORM CARD */}
      <div style={styles.formCard}>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Subject</label>
          <input
            style={styles.input}
            placeholder="What is this regarding? (e.g. Book Renewal, Missing Resource)"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Detailed Message</label>
          <textarea
            style={styles.textarea}
            placeholder="Write your detailed query here..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows="6"
          />
        </div>

        <div style={styles.footer}>
          <p style={styles.infoText}>
            ℹ️ Your query will be sent directly to the administrative desk. 
            You can track the response in the <strong>'My Queries'</strong> section.
          </p>
          <button 
            style={loading ? {...styles.submitBtn, opacity: 0.7} : styles.submitBtn} 
            onClick={handleSendQuery}
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Query Now"}
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "800px",
    margin: "0 auto",
    fontFamily: "'Plus Jakarta Sans', sans-serif",
  },
  header: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
    marginBottom: "30px",
    paddingBottom: "20px",
    borderBottom: "1px solid #eef2f6",
  },
  iconCircle: {
    width: "60px",
    height: "60px",
    backgroundColor: "#e8eaf6",
    borderRadius: "15px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "28px",
  },
  titleArea: { flex: 1 },
  title: {
    fontSize: "1.6rem",
    color: "#1a237e", // Oxford Blue
    fontWeight: "800",
    margin: 0,
  },
  subtitle: {
    fontSize: "0.95rem",
    color: "#64748b",
    marginTop: "5px",
  },
  /* FORM CARD STYLES */
  formCard: {
    backgroundColor: "white",
    padding: "40px",
    borderRadius: "24px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.02)",
    border: "1px solid #eef2f6",
  },
  inputGroup: {
    marginBottom: "25px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  label: {
    fontSize: "0.85rem",
    fontWeight: "700",
    color: "#475569",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    marginLeft: "4px",
  },
  input: {
    padding: "14px 18px",
    borderRadius: "12px",
    border: "2px solid #f1f5f9",
    backgroundColor: "#f8fafc",
    fontSize: "1rem",
    outline: "none",
    transition: "all 0.3s ease",
    fontFamily: "inherit",
  },
  textarea: {
    padding: "14px 18px",
    borderRadius: "12px",
    border: "2px solid #f1f5f9",
    backgroundColor: "#f8fafc",
    fontSize: "1rem",
    outline: "none",
    transition: "all 0.3s ease",
    fontFamily: "inherit",
    resize: "none",
  },
  footer: {
    marginTop: "10px",
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  infoText: {
    fontSize: "0.85rem",
    color: "#64748b",
    lineHeight: "1.5",
    backgroundColor: "#f1f5f9",
    padding: "12px",
    borderRadius: "10px",
  },
  submitBtn: {
    padding: "16px 30px",
    backgroundColor: "#1a237e", // Professional Oxford Blue
    color: "white",
    border: "none",
    borderRadius: "12px",
    fontSize: "1rem",
    fontWeight: "700",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 8px 15px rgba(26, 35, 126, 0.2)",
  }
};

export default UserQuery;