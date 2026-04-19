import React, { useEffect, useState } from "react";
import axios from "axios";

function ReturnBook() {
  const [issuedBooks, setIssuedBooks] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const [selectedReturn, setSelectedReturn] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchIssuedBooks();
  }, []);

  const fetchIssuedBooks = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:5000/admin/active-issued-books");
      if (res.data.success) {
        setIssuedBooks(res.data.issued_books);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const openReturnDialog = async (id) => {
    try {
      const res = await axios.get(`http://127.0.0.1:5000/admin/return-preview/${id}`);
      if (res.data.success) {
        setSelectedReturn(res.data.data);
        setShowDialog(true);
      } else {
        alert(res.data.message);
      }
    } catch (error) {
      alert("Failed to open return preview");
    }
  };

  const handleConfirmReturn = async () => {
    try {
      const res = await axios.put(`http://127.0.0.1:5000/admin/return-book/${selectedReturn.id}`);
      if (res.data.success) {
        alert(`Book returned successfully. Fine collected: ₹${res.data.fine}`);
        setShowDialog(false);
        setSelectedReturn(null);
        fetchIssuedBooks();
      }
    } catch (error) {
      alert("Failed to return book");
    }
  };

  const closeDialog = () => {
    setShowDialog(false);
    setSelectedReturn(null);
  };

  return (
    <div style={styles.container}>
      {/* HEADER */}
      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>Book Return Management</h2>
          <p style={styles.subtitle}>Process incoming books and calculate overdue fines.</p>
        </div>
        <div style={styles.countBadge}>{issuedBooks.length} Active Loans</div>
      </div>

      {/* TABLE */}
      <div style={styles.tableCard}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.theadRow}>
              <th style={styles.th}>ID</th>
              <th style={styles.th}>Member Name</th>
              <th style={styles.th}>Book Title</th>
              <th style={styles.th}>Due Date</th>
              <th style={styles.th}>Status</th>
              <th style={{ ...styles.th, textAlign: "right" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="6" style={styles.loadingText}>Syncing circulation data...</td></tr>
            ) : issuedBooks.length > 0 ? (
              issuedBooks.map((item, index) => (
                <tr key={item.id} style={index % 2 === 0 ? styles.trEven : styles.trOdd}>
                  <td style={styles.td}><span style={styles.idChip}>#{item.id}</span></td>
                  <td style={styles.td}><strong>{item.user_name}</strong></td>
                  <td style={styles.td}>{item.book_title}</td>
                  <td style={styles.td}>
                    <span style={new Date(item.due_date) < new Date() ? styles.overdueText : {}}>{item.due_date}</span>
                  </td>
                  <td style={styles.td}><span style={styles.statusBadge}>{item.status}</span></td>
                  <td style={{ ...styles.td, textAlign: "right" }}>
                    <button style={styles.returnBtn} onClick={() => openReturnDialog(item.id)}>Process Return</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="6" style={styles.noData}>No books are currently issued.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* RETURN CONFIRMATION DIALOG */}
      {showDialog && selectedReturn && (
        <div style={styles.overlay}>
          <div style={styles.dialog}>
            <div style={styles.dialogHeader}>
              <h3 style={{ margin: 0, color: "#1a237e" }}>Return Confirmation</h3>
              <button onClick={closeDialog} style={styles.closeX}>&times;</button>
            </div>
            
            <div style={styles.receiptBody}>
              <div style={styles.detailRow}><span>User:</span> <strong>{selectedReturn.user_name}</strong></div>
              <div style={styles.detailRow}><span>Book:</span> <strong>{selectedReturn.book_title}</strong></div>
              <div style={styles.divider}></div>
              <div style={styles.detailRow}><span>Issue Date:</span> <span>{selectedReturn.issue_date}</span></div>
              <div style={styles.detailRow}><span>Due Date:</span> <span>{selectedReturn.due_date}</span></div>
              
              <div style={styles.fineSection}>
                <span>Fine to Collect:</span>
                <span style={styles.fineAmount}>₹{selectedReturn.fine}</span>
              </div>
            </div>

            <div style={styles.infoAlert}>
              📢 Please collect the fine amount before confirming the return.
            </div>

            <div style={styles.dialogFooter}>
              <button onClick={handleConfirmReturn} style={styles.confirmBtn}>Confirm Return</button>
              <button onClick={closeDialog} style={styles.cancelBtn}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { padding: "10px", fontFamily: "'Inter', sans-serif" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "25px", paddingBottom: "15px", borderBottom: "1px solid #e2e8f0" },
  title: { fontSize: "1.5rem", color: "#1e293b", fontWeight: "800", margin: 0 },
  subtitle: { fontSize: "0.9rem", color: "#64748b", margin: "5px 0 0 0" },
  countBadge: { backgroundColor: "#e8eaf6", color: "#1a237e", padding: "6px 15px", borderRadius: "20px", fontSize: "0.85rem", fontWeight: "700" },
  
  tableCard: { backgroundColor: "white", borderRadius: "16px", overflow: "hidden", border: "1px solid #e2e8f0", boxShadow: "0 4px 6px rgba(0,0,0,0.02)" },
  table: { width: "100%", borderCollapse: "collapse", textAlign: "left" },
  theadRow: { backgroundColor: "#f8fafc", borderBottom: "2px solid #f1f5f9" },
  th: { padding: "18px", fontSize: "0.8rem", textTransform: "uppercase", color: "#64748b", fontWeight: "700" },
  td: { padding: "18px", fontSize: "0.9rem", color: "#1e293b", borderBottom: "1px solid #f1f5f9" },
  trEven: { backgroundColor: "#ffffff" },
  trOdd: { backgroundColor: "#fbfcfd" },
  idChip: { fontFamily: "monospace", color: "#94a3b8", fontWeight: "600" },
  overdueText: { color: "#e11d48", fontWeight: "700" },
  statusBadge: { backgroundColor: "#fff7ed", color: "#c2410c", padding: "4px 10px", borderRadius: "12px", fontSize: "0.75rem", fontWeight: "700" },
  
  returnBtn: { backgroundColor: "#d97706", color: "white", border: "none", padding: "8px 16px", borderRadius: "8px", fontSize: "0.85rem", fontWeight: "700", cursor: "pointer", transition: "0.2s" },

  // DIALOG STYLES
  overlay: { position: "fixed", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(15, 23, 42, 0.6)", backdropFilter: "blur(4px)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 },
  dialog: { background: "white", padding: "30px", borderRadius: "24px", width: "420px", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)" },
  dialogHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" },
  closeX: { background: "none", border: "none", fontSize: "24px", color: "#94a3b8", cursor: "pointer" },
  receiptBody: { backgroundColor: "#f8fafc", padding: "20px", borderRadius: "15px", border: "1px solid #e2e8f0", marginBottom: "20px" },
  detailRow: { display: "flex", justifyContent: "space-between", marginBottom: "10px", fontSize: "0.95rem" },
  divider: { height: "1px", backgroundColor: "#e2e8f0", margin: "15px 0" },
  fineSection: { display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "10px", color: "#1e293b", fontWeight: "800" },
  fineAmount: { fontSize: "1.5rem", color: "#e11d48" },
  infoAlert: { backgroundColor: "#ecfdf5", color: "#065f46", padding: "12px", borderRadius: "10px", fontSize: "0.85rem", fontWeight: "600", marginBottom: "20px", textAlign: "center" },
  dialogFooter: { display: "flex", gap: "10px" },
  confirmBtn: { flex: 1, padding: "12px", backgroundColor: "#059669", color: "white", border: "none", borderRadius: "10px", fontWeight: "700", cursor: "pointer" },
  cancelBtn: { padding: "12px 20px", backgroundColor: "#f1f5f9", color: "#64748b", border: "none", borderRadius: "10px", fontWeight: "700", cursor: "pointer" },
  
  loadingText: { padding: "40px", textAlign: "center", color: "#94a3b8" },
  noData: { padding: "40px", textAlign: "center", color: "#94a3b8" }
};

export default ReturnBook;