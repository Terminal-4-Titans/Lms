import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./AdminDashboard.css";

// Sub-components
import AddUser from "./AddUser";
import ViewUsers from "./ViewUsers";
import DeleteUser from "./DeleteUser";
import AddBook from "./AddBook";
import ViewBooks from "./ViewBooks";
import DeleteBook from "./DeleteBook";
import IssueBook from "./IssueBook";
import ReturnBook from "./ReturnBook";
import NotReturnedBooks from "./NotReturnedBooks";
import Reminder from "./Reminder";
import CustomerQueries from "./CustomerQueries";
import CategoryPieChart from "./CategoryPieChart";
import OverdueBooks from "./OverdueBooks";
import AllReturnedBooks from "./AllReturnedBooks";
import InactiveUsers from "./InactiveUsers";
function AdminDashboard() {
    const navigate = useNavigate();
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [showBookMenu, setShowBookMenu] = useState(false);
    const [showReturnMenu, setShowReturnMenu] = useState(false);
    const [content, setContent] = useState("dashboard");

    const [stats, setStats] = useState({
        total_users: 0,
        total_books: 0,
        issued_books: 0,
        overdue_books: 0,
        total_fine: 0
    });

    useEffect(() => {
        fetchDashboardStats();
    }, []);

    const fetchDashboardStats = async () => {
        try {
            const res = await axios.get("http://127.0.0.1:5000/admin/dashboard-stats");
            if (res.data.success) {
                setStats(res.data);
            }
        } catch (error) {
            console.log("Error fetching stats:", error);
        }
    };

    const Icons = {
        Dashboard: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>,
        Users: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle></svg>,
        Books: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>,
        Issue: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg>,
        Logout: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
    };

    return (
        <div className="dashboard-wrapper">
            {/* --- SIDEBAR --- */}
            <aside className="sidebar">
                <div className="sidebar-brand">
                    <span className="brand-icon">L</span>
                    <h2 className="brand-name">LibSource</h2>
                </div>

                <nav className="sidebar-nav">
                    <button className={`nav-btn btn-overview ${content === "dashboard" ? "active" : ""}`} onClick={() => setContent("dashboard")}>
                        <Icons.Dashboard /> Overview
                    </button>

                    <div className="nav-divider">Inventory</div>

                    {/* USER MANAGEMENT */}
                    <div className="nav-group">
                        <button className={`nav-btn btn-users ${showUserMenu ? "expanded" : ""}`} onClick={() => setShowUserMenu(!showUserMenu)}>
                            <Icons.Users /> Users <span className="chevron">{showUserMenu ? "▼" : "▶"}</span>
                        </button>
                        {showUserMenu && (
                            <div className="nav-submenu menu-users">
                                <button className="submenu-item" onClick={() => setContent("addUser")}><span className="dot"></span> Register User</button>
                                <button className="submenu-item" onClick={() => setContent("viewUsers")}><span className="dot"></span> Manage Users</button>
                                <button className="submenu-item" onClick={() => setContent("deleteUser")}><span className="dot"></span> Remove User</button>
                                <button className="submenu-item" onClick={() => setContent("inactiveUsers")}><span className="dot"></span> Inactive User</button>
                            </div>
                        )}
                    </div>

                    {/* BOOK MANAGEMENT */}
                    <div className="nav-group">
                        <button className={`nav-btn btn-books ${showBookMenu ? "expanded" : ""}`} onClick={() => setShowBookMenu(!showBookMenu)}>
                            <Icons.Books /> Library Books <span className="chevron">{showBookMenu ? "▼" : "▶"}</span>
                        </button>
                        {showBookMenu && (
                            <div className="nav-submenu menu-books">
                                <button className="submenu-item" onClick={() => setContent("addBook")}><span className="dot"></span> Add New Book</button>
                                <button className="submenu-item" onClick={() => setContent("viewBooks")}><span className="dot"></span> Collection List</button>
                                <button className="submenu-item" onClick={() => setContent("deleteBook")}><span className="dot"></span> Remove Book</button>
                            </div>
                        )}
                    </div>

                    <div className="nav-divider">Operations</div>

                    <button className="nav-btn btn-issue" onClick={() => setContent("issueBook")}>
                        <Icons.Issue /> Borrow Circulation
                    </button>

                    {/* RETURNS */}
                    <div className="nav-group">
                        <button className={`nav-btn btn-return ${showReturnMenu ? "expanded" : ""}`} onClick={() => setShowReturnMenu(!showReturnMenu)}>
                            <Icons.Issue /> Return Flow <span className="chevron">{showReturnMenu ? "▼" : "▶"}</span>
                        </button>
                        {showReturnMenu && (
                            <div className="nav-submenu menu-return">
                                <button className="submenu-item" onClick={() => setContent("returnBook")}><span className="dot"></span> Process Return</button>
                                <button className="submenu-item" onClick={() => setContent("notReturnedBooks")}><span className="dot"></span> Pending Returns</button>
                                <button className="submenu-item" onClick={() => setContent("overdueBooks")}><span className="dot"></span> Overdue List</button>
                                <button className="submenu-item" onClick={() => setContent("allReturnedBooks")}><span className="dot"></span> Return History</button>
                            </div>
                        )}
                    </div>

                    <button className="nav-btn btn-remind" onClick={() => setContent("reminder")}>
                        <Icons.Dashboard /> Notifications
                    </button>

                    <button className="nav-btn btn-query" onClick={() => setContent("customerQueries")}>
                        <Icons.Dashboard /> Support Queries
                    </button>
                </nav>

                <button className="nav-logout" onClick={() => navigate("/")}>
                    <Icons.Logout /> System Logout
                </button>
            </aside>

            {/* --- MAIN CONTENT --- */}
            <main className="main-content">
                <header className="main-header">
                    <div className="header-info">
                        <h1>Administrative Dashboard</h1>
                        <p>Welcome back, Librarian. System status is normal.</p>
                    </div>
                    <div className="header-date">
                        <span className="live-pulse"></span> {new Date().toDateString()}
                    </div>
                </header>

                <div className="content-inner">
                    {content === "dashboard" ? (
                        <>
                            <div className="stats-container">
                                <div className="stat-box">
                                    <span className="stat-label">Total Users</span>
                                    <span className="stat-count">{stats.total_users}</span>
                                    <div className="stat-bar blue"></div>
                                </div>
                                <div className="stat-box">
                                    <span className="stat-label">Total Books</span>
                                    <span className="stat-count">{stats.total_books}</span>
                                    <div className="stat-bar indigo"></div>
                                </div>
                                <div className="stat-box">
                                    <span className="stat-label">Issued</span>
                                    <span className="stat-count">{stats.issued_books}</span>
                                    <div className="stat-bar green"></div>
                                </div>
                                <div className="stat-box">
                                    <span className="stat-label">Overdue</span>
                                    <span className="stat-count overdue">{stats.overdue_books}</span>
                                    <div className="stat-bar red"></div>
                                </div>
                                <div className="stat-box">
                                    <span className="stat-label">Total Fines</span>
                                    <span className="stat-count">₹{stats.total_fine}</span>
                                    <div className="stat-bar gold"></div>
                                </div>
                            </div>

                            {/* CENTERED PIE CHART */}
                            <div className="charts-centered-layout">
                                <div className="chart-card-centered">
                                    <h3>Resource Distribution by Category</h3>
                                    <CategoryPieChart />
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="component-viewport">
                            <div className="view-container">
                                {content === "addUser" && <AddUser />}
                                {content === "viewUsers" && <ViewUsers />}
                                {content === "deleteUser" && <DeleteUser />}
                                {content === "addBook" && <AddBook />}
                                {content === "viewBooks" && <ViewBooks />}
                                {content === "deleteBook" && <DeleteBook />}
                                {content === "issueBook" && <IssueBook />}
                                {content === "returnBook" && <ReturnBook />}
                                {content === "notReturnedBooks" && <NotReturnedBooks />}
                                {content === "overdueBooks" && <OverdueBooks />}
                                {content === "allReturnedBooks" && <AllReturnedBooks />}
                                {content === "reminder" && <Reminder />}
                                {content === "customerQueries" && <CustomerQueries />}
                                {content === "inactiveUsers" && <InactiveUsers />}
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

export default AdminDashboard;