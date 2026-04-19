import React, { useEffect, useState } from "react";
import axios from "axios";

function DeleteBook() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const handleDelete = async (id, title) => {
    // Professional confirmation dialog
    const confirmDelete = window.confirm(`Are you sure you want to permanently remove "${title}" from the inventory?`);
    
    if (confirmDelete) {
      try {
        const res = await axios.delete(`http://127.0.0.1:5000/admin/delete-book/${id}`);

        if (res.data.success) {
          alert("Resource deleted successfully");
          fetchBooks(); // Refresh list after deletion
        } else {
          alert(res.data.message);
        }
      } catch (error) {
        console.log(error);
        alert("Failed to delete book. Please try again.");
      }
    }
  };

  return (
    <div style={styles.container}>
      {/* HEADER SECTION */}
      <div style={styles.header}>
        <div style={styles.titleGroup}>
          <h2 style={styles.title}>Inventory Removal</h2>
          <span style={styles.warningBadge}>⚠️ Permanent Action</span>
        </div>
        <p style={styles.subtitle}>Select the books you wish to remove from the library management system.</p>
      </div>

      {/* DATA TABLE */}
      <div style={styles.tableCard}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.theadRow}>
              <th style={styles.th}>ID</th>
              <th style={styles.th}>Resource Details</th>
              <th style={styles.th}>Category</th>
              <th style={styles.th}>Year</th>
              <th style={styles.th}>Qty</th>
              <th style={{ ...styles.th, textAlign: "right" }}>Management</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" style={styles.loadingText}>Loading library records...</td>
              </tr>
            ) : books.length > 0 ? (
              books.map((book, index) => (
                <tr 
                  key={book.id} 
                  style={index % 2 === 0 ? styles.trEven : styles.trOdd}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#fff1f2"}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = index % 2 === 0 ? "#ffffff" : "#fbfcfd"}
                >
                  <td style={styles.td}>
                    <span style={styles.idChip}>#{book.id}</span>
                  </td>
                  <td style={styles.td}>
                    <div style={styles.bookInfo}>
                      <span style={styles.bookTitle}>{book.title}</span>
                      <span style={styles.bookAuthor}>{book.author}</span>
                    </div>
                  </td>
                  <td style={styles.td}>
                    <span style={styles.categoryTag}>{book.category}</span>
                  </td>
                  <td style={styles.td}>{book.year}</td>
                  <td style={styles.td}>{book.quantity}</td>
                  <td style={{ ...styles.td, textAlign: "right" }}>
                    <button 
                      style={styles.deleteBtn} 
                      onClick={() => handleDelete(book.id, book.title)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" style={styles.noData}>No resources found in the inventory.</td>
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
    fontSize: "1.5rem",
    color: "#1e293b",
    margin: 0,
    fontWeight: "800",
  },
  warningBadge: {
    backgroundColor: "#fff1f2",
    color: "#e11d48",
    padding: "4px 12px",
    borderRadius: "20px",
    fontSize: "0.75rem",
    fontWeight: "700",
    border: "1px solid #fecaca",
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
    color: "#475569",
    borderBottom: "1px solid #f1f5f9",
  },
  bookInfo: {
    display: "flex",
    flexDirection: "column",
  },
  bookTitle: {
    fontWeight: "700",
    color: "#1e293b",
    fontSize: "1rem",
  },
  bookAuthor: {
    fontSize: "0.85rem",
    color: "#64748b",
  },
  categoryTag: {
    fontSize: "0.75rem",
    backgroundColor: "#f1f5f9",
    padding: "4px 10px",
    borderRadius: "6px",
    fontWeight: "600",
    color: "#475569",
  },
  trEven: { backgroundColor: "#ffffff" },
  trOdd: { backgroundColor: "#fbfcfd" },
  idChip: {
    fontFamily: "monospace",
    color: "#94a3b8",
    fontWeight: "600",
  },
  deleteBtn: {
    backgroundColor: "#e11d48", // Professional Rose Red
    color: "white",
    border: "none",
    padding: "8px 16px",
    borderRadius: "8px",
    fontSize: "0.85rem",
    fontWeight: "700",
    cursor: "pointer",
    transition: "0.2s",
    boxShadow: "0 4px 6px rgba(225, 29, 72, 0.2)",
  },
  loadingText: {
    padding: "50px",
    textAlign: "center",
    color: "#94a3b8",
    fontStyle: "italic",
  },
  noData: {
    padding: "50px",
    textAlign: "center",
    color: "#94a3b8",
  }
};

export default DeleteBook;