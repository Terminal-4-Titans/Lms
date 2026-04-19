import React, { useState } from "react";
import axios from "axios";

function AddBook() {
  const [form, setForm] = useState({
    title: "",
    author: "",
    category: "",
    year: "",
    quantity: ""
  });

  const [loading, setLoading] = useState(false);

  const categories = [
    "Computer Science", "Programming", "Database", "Networking", "Electronics",
    "Mechanical", "Civil", "Mathematics", "Physics", "Chemistry", "English",
    "Autobiography", "Tamil", "Commerce", "Management", "Aptitude",
    "General Knowledge", "History", "Biography", "Novel", "Other"
  ];

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddBook = async () => {
    if (!form.title || !form.author || !form.category || !form.year || !form.quantity) {
      alert("Please fill all the fields");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post("http://127.0.0.1:5000/admin/add-book", form);

      if (res.data.success) {
        alert("Book added successfully!");
        setForm({ title: "", author: "", category: "", year: "", quantity: "" });
      } else {
        alert(res.data.message);
      }
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Failed to add book");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      {/* HEADER SECTION */}
      <div style={styles.header}>
        <h2 style={styles.title}>Add New Resource</h2>
        <p style={styles.subtitle}>Register a new book into the library inventory.</p>
      </div>

      {/* FORM GRID SECTION */}
      <div style={styles.formGrid}>
        <div style={{ ...styles.inputBox, gridColumn: "span 2" }}>
          <label style={styles.label}>Book Title</label>
          <input
            name="title"
            style={styles.input}
            placeholder="e.g. The Art of Computer Programming"
            value={form.title}
            onChange={handleChange}
          />
        </div>

        <div style={styles.inputBox}>
          <label style={styles.label}>Author Name</label>
          <input
            name="author"
            style={styles.input}
            placeholder="e.g. Donald Knuth"
            value={form.author}
            onChange={handleChange}
          />
        </div>

        <div style={styles.inputBox}>
          <label style={styles.label}>Category</label>
          <select
            name="category"
            style={styles.input}
            value={form.category}
            onChange={handleChange}
          >
            <option value="">-- Select Category --</option>
            {categories.map((cat, index) => (
              <option key={index} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div style={styles.inputBox}>
          <label style={styles.label}>Release Year</label>
          <input
            name="year"
            type="number"
            style={styles.input}
            placeholder="YYYY"
            value={form.year}
            onChange={handleChange}
          />
        </div>

        <div style={styles.inputBox}>
          <label style={styles.label}>Quantity Available</label>
          <input
            name="quantity"
            type="number"
            style={styles.input}
            placeholder="Number of copies"
            value={form.quantity}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* SUBMIT BUTTON */}
      <button
        style={styles.submitBtn}
        onClick={handleAddBook}
        disabled={loading}
        onMouseEnter={(e) => (e.target.style.backgroundColor = "#151b60")}
        onMouseLeave={(e) => (e.target.style.backgroundColor = "#1a237e")}
      >
        {loading ? "Adding to Inventory..." : "Add to Collection"}
      </button>
    </div>
  );
}

const styles = {
  container: {
    padding: "30px",
    maxWidth: "850px",
    margin: "0 auto",
    fontFamily: "'Inter', sans-serif",
  },
  header: {
    marginBottom: "35px",
    borderBottom: "1px solid #edf2f7",
    paddingBottom: "20px",
  },
  title: {
    fontSize: "1.8rem",
    color: "#1a237e", // Oxford Blue
    fontWeight: "800",
    margin: 0,
  },
  subtitle: {
    fontSize: "1rem",
    color: "#718096", // Slate grey
    marginTop: "8px",
  },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "25px",
  },
  inputBox: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  label: {
    fontSize: "0.85rem",
    fontWeight: "700",
    color: "#4a5568", // Darker grey for labels
    marginLeft: "2px",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  input: {
    padding: "14px",
    borderRadius: "12px",
    border: "2px solid #edf2f7", // Soft border
    backgroundColor: "#f8fafc", // Lite background
    fontSize: "1rem",
    outline: "none",
    transition: "all 0.3s ease",
    boxSizing: "border-box",
    color: "#2d3748",
  },
  submitBtn: {
    marginTop: "40px",
    padding: "18px",
    backgroundColor: "#1a237e",
    color: "white",
    border: "none",
    borderRadius: "12px",
    fontSize: "1.1rem",
    fontWeight: "700",
    cursor: "pointer",
    width: "100%",
    boxShadow: "0 10px 15px -3px rgba(26, 35, 126, 0.2)",
    transition: "all 0.2s ease",
  }
};

export default AddBook;