import React, { useEffect, useState } from "react";
import axios from "axios";
import { jsPDF } from "jspdf";

function IssueBook() {
  const [tab, setTab] = useState("issueBook");
  const [users, setUsers] = useState([]);
  const [books, setBooks] = useState([]);
  const [issuedBooks, setIssuedBooks] = useState([]);
  const [activeIssuedBooks, setActiveIssuedBooks] = useState([]);
  const [lastIssuedData, setLastIssuedData] = useState(null);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    user_id: "",
    book_id: "",
    amount: "",
    issue_date: "",
    due_date: ""
  });

  useEffect(() => {
    fetchUsers();
    fetchBooks();
    fetchIssuedBooks();
    fetchActiveIssuedBooks();
  }, []);

  // Calculate Amount based on dates (₹10 per day)
  useEffect(() => {
    if (form.issue_date && form.due_date) {
      const issueDate = new Date(form.issue_date + "T00:00:00");
      const dueDate = new Date(form.due_date + "T00:00:00");
      const diffTime = dueDate.getTime() - issueDate.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays >= 0) {
        setForm((prev) => ({ ...prev, amount: (diffDays + 1) * 10 }));
      } else {
        setForm((prev) => ({ ...prev, amount: "" }));
      }
    }
  }, [form.issue_date, form.due_date]);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:5000/admin/users-list");
      if (res.data.success) setUsers(res.data.users);
    } catch (error) { console.log(error); }
  };

  const fetchBooks = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:5000/admin/books-list");
      if (res.data.success) setBooks(res.data.books);
    } catch (error) { console.log(error); }
  };

  const fetchIssuedBooks = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:5000/admin/issued-books");
      if (res.data.success) setIssuedBooks(res.data.issued_books);
    } catch (error) { console.log(error); }
  };

  const fetchActiveIssuedBooks = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:5000/admin/active-issued-books");
      if (res.data.success) setActiveIssuedBooks(res.data.issued_books);
    } catch (error) { console.log(error); }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleIssueBook = async () => {
    if (!form.user_id || !form.book_id || !form.issue_date || !form.due_date || !form.amount) {
      alert("Please fill all fields");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post("http://127.0.0.1:5000/admin/issue-book", form);
      if (res.data.success) {
        const selectedUser = users.find((u) => String(u.id) === String(form.user_id));
        const selectedBook = books.find((b) => String(b.id) === String(form.book_id));

        const receiptInfo = {
          receiptNo: "LIB-" + Math.floor(100000 + Math.random() * 900000),
          issueId: res.data.issue_id || "N/A",
          userName: selectedUser?.name || "N/A",
          userEmail: selectedUser?.email || "N/A",
          bookTitle: selectedBook?.title || "N/A",
          amount: form.amount,
          issueDate: form.issue_date,
          dueDate: form.due_date
        };

        setLastIssuedData(receiptInfo);
        alert("Book Issued Successfully!");
        setForm({ user_id: "", book_id: "", amount: "", issue_date: "", due_date: "" });
        fetchBooks();
        fetchIssuedBooks();
        fetchActiveIssuedBooks();
      }
    } catch (error) {
      alert(error.response?.data?.message || "Failed to issue book");
    } finally {
      setLoading(false);
    }
  };

  // BEAUTIFUL PRINT BILL FUNCTION
  const printBill = () => {
    if (!lastIssuedData) return;

    const billWindow = window.open("", "_blank");
    billWindow.document.write(`
      <html>
        <head>
          <title>Library Receipt - ${lastIssuedData.receiptNo}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap');
            body { font-family: 'Inter', sans-serif; padding: 40px; color: #333; }
            .receipt-card { max-width: 500px; margin: auto; border: 1px solid #e2e8f0; padding: 30px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
            .header { text-align: center; border-bottom: 2px dashed #e2e8f0; padding-bottom: 20px; margin-bottom: 20px; }
            .logo { font-size: 24px; font-weight: 800; color: #1a237e; margin-bottom: 5px; }
            .receipt-no { font-size: 14px; color: #64748b; text-transform: uppercase; letter-spacing: 1px; }
            .detail-row { display: flex; justify-content: space-between; margin-bottom: 12px; font-size: 15px; }
            .label { color: #64748b; }
            .value { font-weight: 700; color: #1e293b; }
            .total-section { border-top: 2px solid #1a237e; margin-top: 20px; padding-top: 15px; }
            .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #94a3b8; }
            .stamp { border: 2px solid #1a237e; width: 100px; height: 100px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #1a237e; font-weight: 800; transform: rotate(-15deg); margin: 20px auto; opacity: 0.2; }
          </style>
        </head>
        <body>
          <div class="receipt-card">
            <div class="header">
              <div class="logo">LIBSOURCE PORTAL</div>
              <div class="receipt-no">OFFICIAL RECEIPT: ${lastIssuedData.receiptNo}</div>
            </div>
            <div class="detail-row"><span class="label">Member:</span> <span class="value">${lastIssuedData.userName}</span></div>
            <div class="detail-row"><span class="label">Book Issued:</span> <span class="value">${lastIssuedData.bookTitle}</span></div>
            <div class="detail-row"><span class="label">Issue Date:</span> <span class="value">${lastIssuedData.issueDate}</span></div>
            <div class="detail-row"><span class="label">Due Date:</span> <span class="value" style="color: #e11d48">${lastIssuedData.dueDate}</span></div>
            
            <div class="total-section">
              <div class="detail-row" style="font-size: 18px;">
                <span class="label" style="color: #1e293b; font-weight: 800;">TOTAL PAID:</span> 
                <span class="value">₹${lastIssuedData.amount}.00</span>
              </div>
            </div>

            <div class="stamp">PAID</div>
            <div class="footer">Thank you for using LibSource Management. <br/> Please return the book on or before the due date.</div>
          </div>
          <script>window.print();</script>
        </body>
      </html>
    `);
    billWindow.document.close();
  };

  // BEAUTIFUL PDF DOWNLOAD FUNCTION
  const downloadPdf = () => {
    if (!lastIssuedData) return;
    const doc = new jsPDF('p', 'mm', 'a5');
    
    // Background Color
    doc.setFillColor(26, 35, 126);
    doc.rect(0, 0, 150, 30, 'F');
    
    // Header
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.text("LIBSOURCE PORTAL", 75, 15, { align: "center" });
    doc.setFontSize(10);
    doc.text("Library Resource Management System", 75, 22, { align: "center" });

    // Receipt Body
    doc.setTextColor(50, 50, 50);
    doc.setFontSize(10);
    doc.text(`RECEIPT NO: ${lastIssuedData.receiptNo}`, 20, 45);
    doc.setDrawColor(200, 200, 200);
    doc.line(20, 48, 130, 48);

    doc.setFont("helvetica", "bold");
    doc.text("MEMBER DETAILS", 20, 60);
    doc.setFont("helvetica", "normal");
    doc.text(`Name: ${lastIssuedData.userName}`, 20, 68);
    doc.text(`Email: ${lastIssuedData.userEmail}`, 20, 74);

    doc.setFont("helvetica", "bold");
    doc.text("BOOK DETAILS", 20, 90);
    doc.setFont("helvetica", "normal");
    doc.text(`Book Title: ${lastIssuedData.bookTitle}`, 20, 98);
    doc.text(`Issue Date: ${lastIssuedData.issueDate}`, 20, 104);
    doc.setTextColor(225, 29, 72);
    doc.text(`Due Date: ${lastIssuedData.dueDate}`, 20, 110);

    // Total
    doc.setTextColor(0, 0, 0);
    doc.rect(20, 120, 110, 15);
    doc.setFontSize(12);
    doc.text(`TOTAL AMOUNT: Rs. ${lastIssuedData.amount}.00`, 75, 130, { align: "center" });

    // Footer
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text("Automated Receipt Generated by LibSource", 75, 150, { align: "center" });

    doc.save(`Receipt_${lastIssuedData.receiptNo}.pdf`);
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Circulation Management</h2>
        <div style={styles.tabWrapper}>
          <button className="tab-btn" style={tab === "issueBook" ? styles.activeTab : styles.tab} onClick={() => setTab("issueBook")}>Borrow</button>
          <button className="tab-btn" style={tab === "currentIssued" ? styles.activeTab : styles.tab} onClick={() => setTab("currentIssued")}>Currently Borrowed</button>
          <button className="tab-btn" style={tab === "allIssued" ? styles.activeTab : styles.tab} onClick={() => setTab("allIssued")}>Transaction Log</button>
        </div>
      </div>

      <div style={styles.contentBody}>
        {tab === "issueBook" && (
          <div style={styles.formCard}>
            <div style={styles.grid}>
              <div style={styles.inputBox}>
                <label style={styles.label}>Select Member</label>
                <select name="user_id" style={styles.input} value={form.user_id} onChange={handleChange}>
                  <option value="">-- Choose User --</option>
                  {users.map((u) => <option key={u.id} value={u.id}>{u.name} ({u.email})</option>)}
                </select>
              </div>
              <div style={styles.inputBox}>
                <label style={styles.label}>Select Book</label>
                <select name="book_id" style={styles.input} value={form.book_id} onChange={handleChange}>
                  <option value="">-- Choose Book --</option>
                  {books.map((b) => <option key={b.id} value={b.id}>{b.title} (Stock: {b.available})</option>)}
                </select>
              </div>
              <div style={styles.inputBox}>
                <label style={styles.label}>Issue Date</label>
                <input type="date" name="issue_date" style={styles.input} value={form.issue_date} onChange={handleChange} />
              </div>
              <div style={styles.inputBox}>
                <label style={styles.label}>Due Date</label>
                <input type="date" name="due_date" style={styles.input} value={form.due_date} onChange={handleChange} />
              </div>
              <div style={styles.inputBox}>
                <label style={styles.label}>Estimated Fee (₹)</label>
                <input name="amount" style={styles.amountInput} value={form.amount} readOnly />
              </div>
            </div>

            <button style={styles.submitBtn} onClick={handleIssueBook} disabled={loading}>
              {loading ? "Processing..." : "Authorize Issue"}
            </button>

            {lastIssuedData && (
              <div style={styles.successCard}>
                <div style={{display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px'}}>
                   <div style={styles.successIcon}>✓</div>
                   <div style={{textAlign: 'left'}}>
                     <h4 style={{margin: 0, color: '#065f46'}}>Transaction Success!</h4>
                     <p style={{margin: 0, fontSize: '13px', color: '#047857'}}>Receipt: {lastIssuedData.receiptNo}</p>
                   </div>
                </div>
                <div style={styles.btnRow}>
                  <button onClick={printBill} style={styles.printBtn}>🖨️ Print Receipt</button>
                  <button onClick={downloadPdf} style={styles.pdfBtn}>📄 Download PDF</button>
                </div>
              </div>
            )}
          </div>
        )}

        {(tab === "currentIssued" || tab === "allIssued") && (
          <div style={styles.tableCard}>
            <table style={styles.table}>
              <thead>
                <tr style={styles.theadRow}>
                  <th style={styles.th}>ID</th>
                  <th style={styles.th}>Member</th>
                  <th style={styles.th}>Book Title</th>
                  <th style={styles.th}>Issue Date</th>
                  <th style={styles.th}>Due Date</th>
                  {tab === "allIssued" && <th style={styles.th}>Fine</th>}
                  <th style={styles.th}>Status</th>
                </tr>
              </thead>
              <tbody>
                {(tab === "currentIssued" ? activeIssuedBooks : issuedBooks).map((item, idx) => (
                  <tr key={idx} style={idx % 2 === 0 ? styles.trEven : styles.trOdd}>
                    <td style={styles.td}>#{item.id}</td>
                    <td style={styles.td}><strong>{item.user_name}</strong></td>
                    <td style={styles.td}>{item.book_title}</td>
                    <td style={styles.td}>{item.issue_date}</td>
                    <td style={styles.td}>{item.due_date}</td>
                    {tab === "allIssued" && <td style={styles.td}>₹{item.fine}</td>}
                    <td style={styles.td}>
                      <span style={item.status === 'issued' ? styles.statusBadgePending : styles.statusBadgeActive}>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: { padding: "10px", fontFamily: "'Inter', sans-serif" },
  header: { marginBottom: "25px", borderBottom: "1px solid #e2e8f0", paddingBottom: "20px" },
  title: { fontSize: "1.5rem", color: "#1e293b", fontWeight: "800", marginBottom: "20px" },
  tabWrapper: { display: "inline-flex", background: "#f1f5f9", padding: "6px", borderRadius: "14px" },
  tab: { padding: "10px 22px", border: "none", background: "none", color: "#64748b", fontWeight: "600", cursor: "pointer", borderRadius: "10px", transition: "0.2s" },
  activeTab: { padding: "10px 22px", border: "none", background: "#1a237e", color: "white", fontWeight: "600", borderRadius: "10px", boxShadow: "0 4px 6px rgba(26, 35, 126, 0.2)" },
  contentBody: { marginTop: "20px" },
  formCard: { background: "white", padding: "40px", borderRadius: "20px", border: "1px solid #e2e8f0", boxShadow: "0 4px 15px rgba(0,0,0,0.02)" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "25px" },
  inputBox: { display: "flex", flexDirection: "column", gap: "10px" },
  label: { fontSize: "0.8rem", fontWeight: "700", color: "#475569", textTransform: "uppercase", letterSpacing: "0.5px" },
  input: { padding: "14px", borderRadius: "12px", border: "2px solid #f1f5f9", outline: "none", fontSize: "0.95rem", backgroundColor: "#f8fafc" },
  amountInput: { padding: "14px", borderRadius: "12px", border: "2px solid #e2e8f0", outline: "none", fontSize: "1.1rem", fontWeight: "800", backgroundColor: "#f0f4f8", color: "#1a237e" },
  submitBtn: { marginTop: "35px", width: "100%", padding: "16px", background: "#1a237e", color: "white", border: "none", borderRadius: "12px", fontWeight: "700", cursor: "pointer", boxShadow: "0 10px 20px rgba(26, 35, 126, 0.15)" },
  
  // SUCCESS RECEIPT PREVIEW
  successCard: { marginTop: "35px", padding: "25px", background: "#ecfdf5", border: "1px solid #d1fae5", borderRadius: "16px" },
  successIcon: { width: "35px", height: "35px", background: "#10b981", color: "white", borderRadius: "50%", display: "flex", alignItems: "center", justifyCenter: "center", fontSize: "18px", fontWeight: "bold", textAlign: "center", lineHeight: '35px' },
  btnRow: { display: "flex", gap: "15px", marginTop: "10px" },
  printBtn: { padding: "12px 25px", background: "#059669", color: "white", border: "none", borderRadius: "10px", fontWeight: "700", cursor: "pointer" },
  pdfBtn: { padding: "12px 25px", background: "#334155", color: "white", border: "none", borderRadius: "10px", fontWeight: "700", cursor: "pointer" },
  
  // TABLE STYLES
  tableCard: { background: "white", borderRadius: "16px", overflow: "hidden", border: "1px solid #e2e8f0" },
  table: { width: "100%", borderCollapse: "collapse", textAlign: "left" },
  theadRow: { background: "#f8fafc", borderBottom: "2px solid #f1f5f9" },
  th: { padding: "18px", fontSize: "0.8rem", color: "#64748b", textTransform: "uppercase", fontWeight: "700" },
  td: { padding: "18px", fontSize: "0.9rem", color: "#1e293b", borderBottom: "1px solid #f1f5f9" },
  trEven: { background: "#ffffff" },
  trOdd: { background: "#fbfcfd" },
  statusBadgePending: { background: "#fff7ed", color: "#c2410c", padding: "5px 12px", borderRadius: "20px", fontSize: "0.75rem", fontWeight: "700", border: "1px solid #ffedd5" },
  statusBadgeActive: { background: "#f0fdf4", color: "#15803d", padding: "5px 12px", borderRadius: "20px", fontSize: "0.75rem", fontWeight: "700", border: "1px solid #dcfce7" }
};

export default IssueBook;