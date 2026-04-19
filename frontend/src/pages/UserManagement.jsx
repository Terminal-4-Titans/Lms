import React from "react";
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";

function UserManagement() {
    const navigate = useNavigate();

    return (
        <div className="admin-container">
            <div className="sidebar">
                <h2 className="logo">Library Admin</h2>

              <button className="sidebar-btn" onClick={() => navigate("/admin-dashboard")}>
          Dashboard
        </button>

        <button className="sidebar-btn" onClick={() => navigate("/user-management")}>
          User Management
        </button>

        <button className="sidebar-btn" onClick={() => navigate("/book-management")}>
          Book Management
        </button>

        <button className="sidebar-btn" onClick={() => navigate("/issue-book")}>
          Issue Book
        </button>

        <button className="sidebar-btn" onClick={() => navigate("/return-book")}>
          Return Book
        </button>

        <button className="sidebar-btn" onClick={() => navigate("/not-returned-books")}>
          Not Returned Books
        </button>

        <button className="sidebar-btn logout-btn" onClick={() => navigate("/")}>
          Logout
        </button>

            </div>

            <div className="main-content">
                <h1>User Management</h1>
                <p>Here you can add, view and manage users.</p>
            </div>
        </div>
    );
}

export default UserManagement;