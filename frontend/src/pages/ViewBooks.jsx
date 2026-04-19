import React, { useEffect, useState } from "react";
import axios from "axios";

function ViewBooks() {
  const [books, setBooks] = useState([]);
  const [editBookId, setEditBookId] = useState(null);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    title: "",
    author: "",
    category: "",
    year: "",
    quantity: ""
  });

  const categories = [
    "Computer Science", "Programming", "Database", "Networking", "Electronics", 
    "Mechanical", "Civil", "Mathematics", "Physics", "Chemistry", "English", 
    "Tamil", "Commerce", "Management", "Aptitude", "General Knowledge", 
    "History", "Biography", "Novel", "Other"
  ];

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:5000/admin/all-books");
      if (res.data.success) {
        setBooks(res.data.books);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (book) => {
    setEditBookId(book.id);
    setForm({
      title: book.title,
      author: book.author,
      category: book.category || "",
      year: book.year || "",
      quantity: book.quantity
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditBookId(null);
    setForm({ title: "", author: "", category: "", year: "", quantity: "" });
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      const res = await axios.put(`http://127.0.0.1:5000/admin/update-book/${editBookId}`, form);
      if (res.data.success) {
        alert("Book record updated successfully");
        cancelEdit();
        fetchBooks();
      }
    } catch (error) {
      alert(error.response?.data?.message || "Update failed");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Library Inventory</h2>
        <p style={styles.subtitle}>View and manage all book resources available in the system.</p>
      </div>

      {/* QUICK EDIT SECTION */}
      {editBookId && (
        <div style={styles.editCard}>
          <div style={styles.editHeader}>
            <h3 style={styles.editTitle}>📝 Modify Book Details (ID: {editBookId})</h3>
            <button onClick={cancelEdit} style={styles.closeBtn}>Close</button>
          </div>

          <div style={styles.formGrid}>
            <div style={{ ...styles.inputBox, gridColumn: "span 2" }}>
              <label style={styles.label}>Book Title</label>
              <input name="title" style={styles.input} value={form.title} onChange={handleChange} />
            </div>
            <div style={styles.inputBox}>
              <label style={styles.label}>Author</label>
              <input name="author" style={styles.input} value={form.author} onChange={handleChange} />
            </div>
            <div style={styles.inputBox}>
              <label style={styles.label}>Category</label>
              <select name="category" style={styles.input} value={form.category} onChange={handleChange}>
                <option value="">Select Category</option>
                {categories.map((cat, i) => <option key={i} value={cat}>{cat}</option>)}
              </select>
            </div>
            <div style={styles.inputBox}>
              <label style={styles.label}>Year</label>
              <input name="year" style={styles.input} value={form.year} onChange={handleChange} />
            </div>
            <div style={styles.inputBox}>
              <label style={styles.label}>Total Quantity</label>
              <input name="quantity" style={styles.input} value={form.quantity} onChange={handleChange} />
            </div>
          </div>

          <div style={styles.editActions}>
            <button onClick={handleUpdate} style={styles.saveBtn}>Save Changes</button>
            <button onClick={cancelEdit} style={styles.cancelBtn}>Cancel</button>
          </div>
        </div>
      )}

      {/* INVENTORY TABLE */}
      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.theadRow}>
              <th style={styles.th}>ID</th>
              <th style={styles.th}>Book Title</th>
              <th style={styles.th}>Author</th>
              <th style={styles.th}>Category</th>
              <th style={styles.th}>Year</th>
              <th style={styles.th}>Stock</th>
              <th style={styles.th}>Available</th>
              <th style={{ ...styles.th, textAlign: "center" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="8" style={styles.loadingText}>Syncing records...</td></tr>
            ) : (
              books.map((book, index) => (
                <tr key={book.id} style={index % 2 === 0 ? styles.trEven : styles.trOdd}>
                  <td style={styles.td}><span style={styles.idLabel}>#{book.id}</span></td>
                  <td style={{ ...styles.td, fontWeight: "600", color: "#1a237e" }}>{book.title}</td>
                  <td style={styles.td}>{book.author}</td>
                  <td style={styles.td}><span style={styles.categoryTag}>{book.category}</span></td>
                  <td style={styles.td}>{book.year}</td>
                  <td style={styles.td}>{book.quantity}</td>
                  <td style={styles.td}>
                    <span style={book.available > 0 ? styles.statusIn : styles.statusOut}>
                      {book.available} Units
                    </span>
                  </td>
                  <td style={{ ...styles.td, textAlign: "center" }}>
                    <button style={styles.updateBtn} onClick={() => startEdit(book)}>Edit</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const styles = {
  container: { padding: "20px", fontFamily: "'Inter', sans-serif" },
  header: { marginBottom: "30px", borderBottom: "1px solid #e2e8f0", paddingBottom: "15px" },
  title: { fontSize: "1.6rem", color: "#1a237e", fontWeight: "800", margin: 0 },
  subtitle: { fontSize: "0.95rem", color: "#64748b", marginTop: "5px" },
  
  // Edit Card Styles
  editCard: {
    backgroundColor: "#fff",
    padding: "25px",
    borderRadius: "15px",
    boxShadow: "0 10px 25px rgba(26, 35, 126, 0.1)",
    border: "2px solid #e8eaf6",
    marginBottom: "30px"
  },
  editHeader: { display: "flex", justifyContent: "space-between", marginBottom: "20px" },
  editTitle: { margin: 0, fontSize: "1.2rem", color: "#1a237e" },
  formGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" },
  label: { fontSize: "0.8rem", fontWeight: "700", color: "#475569", textTransform: "uppercase", marginBottom: "5px" },
  input: { padding: "10px", borderRadius: "8px", border: "1px solid #e2e8f0", backgroundColor: "#f8fafc", outline: "none" },
  editActions: { marginTop: "20px", display: "flex", gap: "10px" },
  saveBtn: { padding: "10px 20px", backgroundColor: "#059669", color: "#fff", border: "none", borderRadius: "8px", fontWeight: "600", cursor: "pointer" },
  cancelBtn: { padding: "10px 20px", backgroundColor: "#f1f5f9", color: "#475569", border: "none", borderRadius: "8px", fontWeight: "600", cursor: "pointer" },

  // Table Styles
  tableWrapper: { backgroundColor: "#fff", borderRadius: "12px", overflow: "hidden", border: "1px solid #e2e8f0", boxShadow: "0 4px 6px rgba(0,0,0,0.02)" },
  table: { width: "100%", borderCollapse: "collapse", textAlign: "left" },
  theadRow: { backgroundColor: "#f8fafc", borderBottom: "2px solid #e2e8f0" },
  th: { padding: "15px 20px", fontSize: "0.8rem", textTransform: "uppercase", color: "#64748b", fontWeight: "700" },
  td: { padding: "15px 20px", fontSize: "0.9rem", color: "#475569", borderBottom: "1px solid #f1f5f9" },
  trEven: { backgroundColor: "#fff" },
  trOdd: { backgroundColor: "#fbfcfd" },
  idLabel: { fontFamily: "monospace", color: "#94a3b8" },
  categoryTag: { backgroundColor: "#eef2ff", color: "#4338ca", padding: "4px 10px", borderRadius: "20px", fontSize: "0.75rem", fontWeight: "600" },
  statusIn: { color: "#059669", fontWeight: "700" },
  statusOut: { color: "#e11d48", fontWeight: "700" },
  updateBtn: { backgroundColor: "#e8eaf6", color: "#1a237e", border: "none", padding: "6px 15px", borderRadius: "6px", fontWeight: "600", cursor: "pointer" },
  loadingText: { textAlign: "center", padding: "40px", color: "#94a3b8" }
};

export default ViewBooks;