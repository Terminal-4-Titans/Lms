import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./UserDashboard.css";

// Sub-components
import ViewBooksUser from "./ViewBooksUser";
import MyIssuedBooks from "./MyIssuedBooks";
import FineDetails from "./FineDetails";
import UserReminder from "./UserReminder";
import UserQuery from "./UserQuery";
import MyQueries from "./MyQueries";
import UserCategoryPieChart from "./UserCategoryPieChart";

function UserDashboard() {
    const navigate = useNavigate();
    const [content, setContent] = useState("dashboard");
    const [stats, setStats] = useState({
        my_issued_books: 0,
        due_soon: 0,
        overdue: 0,
        total_fine: 0
    });

    const userName = localStorage.getItem("user_name") || "Member";
    const userId = localStorage.getItem("user_id");

    useEffect(() => {
        if (!userId) {
            navigate("/user-login");
        } else {
            fetchDashboardStats();
        }
    }, [userId, navigate]);

    const fetchDashboardStats = async () => {
        try {
            const res = await axios.get(`http://127.0.0.1:5000/user/dashboard-stats/${userId}`);
            if (res.data.success) {
                setStats(res.data);
            }
        } catch (error) {
            console.log("Error fetching user stats:", error);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("user_id");
        localStorage.removeItem("user_name");
        navigate("/user-login");
    };

    // Icons for Sidebar
    const Icons = {
        Dashboard: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>,
        Library: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>,
        Book: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>,
        Wallet: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>,
        Bell: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>,
        Chat: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>,
        Logout: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
    };

    return (
        <div className="user-dashboard-wrapper">
            {/* --- SIDEBAR --- */}
            <aside className="user-sidebar">
                <div className="user-sidebar-brand">
                    <div className="user-brand-icon">M</div>
                    <h2 className="user-brand-name">Member Portal</h2>
                </div>

                <nav className="user-sidebar-nav">
                    <button className={`user-nav-btn btn-dash ${content === "dashboard" ? "active" : ""}`} onClick={() => setContent("dashboard")}>
                        <Icons.Dashboard /> Dashboard
                    </button>

                    <div className="user-nav-divider">Explore</div>

                    <button className={`user-nav-btn btn-view ${content === "viewBooks" ? "active" : ""}`} onClick={() => setContent("viewBooks")}>
                        <Icons.Library /> Browse Library
                    </button>

                    <div className="user-nav-divider">My Records</div>

                    <button className={`user-nav-btn btn-issued ${content === "myIssuedBooks" ? "active" : ""}`} onClick={() => setContent("myIssuedBooks")}>
                        <Icons.Book /> My Borrowing
                    </button>

                    <button className={`user-nav-btn btn-fine ${content === "fineDetails" ? "active" : ""}`} onClick={() => setContent("fineDetails")}>
                        <Icons.Wallet /> Fine Details
                    </button>

                    <button className={`user-nav-btn btn-remind ${content === "reminder" ? "active" : ""}`} onClick={() => setContent("reminder")}>
                        <Icons.Bell /> Notifications
                    </button>

                    <div className="user-nav-divider">Support</div>

                    <button className={`user-nav-btn btn-queries ${content === "myQueries" ? "active" : ""}`} onClick={() => setContent("myQueries")}>
                        <Icons.Chat /> My Queries
                    </button>

                    <button className={`user-nav-btn btn-send ${content === "query" ? "active" : ""}`} onClick={() => setContent("query")}>
                        <Icons.Chat /> Contact Librarian
                    </button>
                </nav>

                <button className="user-logout-btn" onClick={handleLogout}>
                    <Icons.Logout /> Sign Out
                </button>
            </aside>

            {/* --- MAIN CONTENT --- */}
            <main className="user-main-content">
                <header className="user-header">
                    <div className="user-welcome">
                        <h1>Welcome back, {userName}! 👋</h1>
                        <p>Track your reading journey and library resources.</p>
                    </div>
                    <div className="user-header-date">
                        <span className="user-status-dot"></span> {new Date().toDateString()}
                    </div>
                </header>

                <div className="user-content-inner">
                    {content === "dashboard" ? (
                        <div className="user-dashboard-home">
                            {/* STATS CARDS */}
                            <div className="user-stats-grid">
                                <div className="user-stat-card card-blue">
                                    <span className="stat-card-label">Total Loans</span>
                                    <span className="stat-card-value">{stats.my_issued_books}</span>
                                    <div className="stat-card-bar"></div>
                                </div>
                                <div className="user-stat-card card-indigo">
                                    <span className="stat-card-label">Returning Soon</span>
                                    <span className="stat-card-value">{stats.due_soon}</span>
                                    <div className="stat-card-bar"></div>
                                </div>
                                <div className="user-stat-card card-red">
                                    <span className="stat-card-label">Overdue</span>
                                    <span className="stat-card-value danger">{stats.overdue}</span>
                                    <div className="stat-card-bar"></div>
                                </div>
                                <div className="user-stat-card card-gold">
                                    <span className="stat-card-label">Outstanding Fine</span>
                                    <span className="stat-card-value">₹{stats.total_fine}</span>
                                    <div className="stat-card-bar"></div>
                                </div>
                            </div>

                            {/* CHART AREA */}
                            <div className="user-chart-section">
                                <div className="user-chart-card">
                                    <h3>My Reading Preferences</h3>
                                    <div className="user-pie-wrapper">
                                        <UserCategoryPieChart />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="user-component-container">
                            {content === "viewBooks" && <ViewBooksUser />}
                            {content === "myIssuedBooks" && <MyIssuedBooks />}
                            {content === "fineDetails" && <FineDetails />}
                            {content === "reminder" && <UserReminder />}
                            {content === "query" && <UserQuery />}
                            {content === "myQueries" && <MyQueries />}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

export default UserDashboard;