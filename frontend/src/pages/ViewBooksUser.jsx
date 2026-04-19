import React, { useEffect, useState } from "react";
import axios from "axios";

function ViewBooksUser() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:5000/admin/all-books-public");
      if (res.data.success) {
        setBooks(res.data.books);
      }
    } catch (error) {
      console.log(error);
      alert("Failed to fetch books archive");
    } finally {
      setLoading(false);
    }
  };

  // Filter books based on search term
  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={styles.container}>
      {/* HEADER SECTION */}
      <div style={styles.header}>
        <div style={styles.titleArea}>
          <h2 style={styles.title}>Library Catalog</h2>
          <p style={styles.subtitle}>Explore our collection of digital and physical resources.</p>
        </div>
        <div style={styles.searchBox}>
          <span style={styles.searchIcon}>🔍</span>
          <input
            type="text"
            placeholder="Search by title, author or category..."
            style={styles.searchInput}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* BOOKS TABLE */}
      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.theadRow}>
              <th style={styles.th}>Book Details</th>
              <th style={styles.th}>Category</th>
              <th style={styles.th}>Release</th>
              <th style={styles.th}>Availability</th>
              <th style={{ ...styles.th, textAlign: "center" }}>Stock</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="5" style={styles.loadingText}>Accessing library database...</td></tr>
            ) : filteredBooks.length > 0 ? (
              filteredBooks.map((book, index) => (
                <tr
                  key={book.id}
                  style={index % 2 === 0 ? styles.trEven : styles.trOdd}
                  className="book-row"
                >
                  <td style={styles.td}>
                    <div style={styles.bookInfo}>
                      <span style={styles.bookTitle}>{book.title}</span>
                      <span style={styles.bookAuthor}>by {book.author}</span>
                    </div>
                  </td>
                  <td style={styles.td}>
                    <span style={styles.categoryChip}>{book.category}</span>
                  </td>
                  <td style={styles.td}>{book.year}</td>
                  <td style={styles.td}>
                    {book.available > 0 ? (
                      <span style={styles.statusIn}>● Available</span>
                    ) : (
                      <span style={styles.statusOut}>● Out of Stock</span>
                    )}
                  </td>
                  <td style={{ ...styles.td, textAlign: "center" }}>
                    <div style={styles.stockCount}>
                      <span style={styles.availNum}>{book.available}</span>
                      <span style={styles.totalNum}>/ {book.quantity}</span>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={styles.noData}>
                  No books matching your search criteria were found.
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
    alignItems: "flex-end",
    marginBottom: "30px",
    gap: "20px",
    flexWrap: "wrap",
  },
  titleArea: {
    flex: 1,
  },
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
  searchBox: {
    position: "relative",
    width: "100%",
    maxWidth: "400px",
  },
  searchIcon: {
    position: "absolute",
    left: "15px",
    top: "50%",
    transform: "translateY(-50%)",
    color: "#94a3b8",
  },
  searchInput: {
    width: "100%",
    padding: "12px 15px 12px 45px",
    borderRadius: "12px",
    border: "1px solid #e2e8f0",
    backgroundColor: "#ffffff",
    fontSize: "0.9rem",
    outline: "none",
    boxShadow: "0 2px 4px rgba(0,0,0,0.02)",
    transition: "border-color 0.2s",
  },
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
    padding: "18px 24px",
    fontSize: "0.9rem",
    color: "#475569",
    borderBottom: "1px solid #f1f5f9",
  },
  bookInfo: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  bookTitle: {
    fontWeight: "700",
    color: "#1e293b",
    fontSize: "1rem",
  },
  bookAuthor: {
    fontSize: "0.85rem",
    color: "#94a3b8",
  },
  categoryChip: {
    backgroundColor: "#f1f5f9",
    color: "#475569",
    padding: "4px 10px",
    borderRadius: "8px",
    fontSize: "0.75rem",
    fontWeight: "600",
    border: "1px solid #e2e8f0",
  },
  statusIn: {
    color: "#10b981", // Success Green
    fontWeight: "700",
    fontSize: "0.85rem",
  },
  statusOut: {
    color: "#ef4444", // Danger Red
    fontWeight: "700",
    fontSize: "0.85rem",
  },
  stockCount: {
    display: "flex",
    justifyContent: "center",
    alignItems: "baseline",
    gap: "2px",
  },
  availNum: {
    fontSize: "1rem",
    fontWeight: "800",
    color: "#1a237e",
  },
  totalNum: {
    fontSize: "0.75rem",
    color: "#94a3b8",
  },
  trEven: { backgroundColor: "#ffffff" },
  trOdd: { backgroundColor: "#fbfcfd" },
  loadingText: { padding: "50px", textAlign: "center", color: "#94a3b8", fontStyle: "italic" },
  noData: { padding: "50px", textAlign: "center", color: "#64748b" }
};

export default ViewBooksUser;