import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminLogin from "./pages/AdminLogin";
import VerifyOTP from "./pages/VerifyOTP";
import AdminDashboard from "./pages/AdminDashboard";
import UserManagement from "./pages/UserManagement";
import BookManagement from "./pages/BookManagement";
import IssueBook from "./pages/IssueBook";
import ReturnBook from "./pages/ReturnBook";
import NotReturnedBooks from "./pages/NotReturnedBooks";
import AddUser from "./pages/AddUser";
import ViewUsers from "./pages/ViewUsers";
import DeleteUser from "./pages/DeleteUser";
import UserLogin from "./pages/UserLogin";
import UserDashboard from "./pages/UserDashboard";
import UserSignUp from "./pages/UserSignUp";
import ForgotPassword from "./pages/ForgotPassword";
import Home from "./pages/Home";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/user-management" element={<UserManagement />} />
        <Route path="/book-management" element={<BookManagement />} />
        <Route path="/issue-book" element={<IssueBook />} />
        <Route path="/return-book" element={<ReturnBook />} />
        <Route path="/not-returned-books" element={<NotReturnedBooks />} />
        <Route path="/add-user" element={<AddUser />} />
        <Route path="/view-users" element={<ViewUsers />} />
        <Route path="/delete-user" element={<DeleteUser />} />
        <Route path="/user-login" element={<UserLogin />} />
        <Route path="/user-dashboard" element={<UserDashboard />} />
        <Route path="/user-signup" element={<UserSignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;