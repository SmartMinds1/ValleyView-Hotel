import React, { useState, useEffect } from 'react';
import './admin.css';
import AdminNavIcons from '../components/AdminNavIcons';
import UsersList from './UsersList';
import MessagesList from './MessagesList';
import CommentsList from './CommentsList';
import BookingsList from './BookingsList';
import PaymentsList from './PaymentsList';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUsers,
  faEnvelope,
  faCommentDots,
  faCalendarCheck,
  faBars,
  faBell,
  faSearch,
  faChartLine
} from "@fortawesome/free-solid-svg-icons";
import api from "../api/axiosInstance";
import { jwtDecode } from "jwt-decode";
import LogoutButton from './logoutButton';

const Admin = () => {
    const [activeAdmin, setActiveAdmin] = useState("");
    const [activeTab, setActiveTab] = useState("users");
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [usersCount, setUsersCount] = useState("");
    const [messagesCount, setMessagesCount] = useState("");
    const [bookingsCount, setBookingsCount] = useState("");
    const [paymentsCount, setPaymentsCount] = useState("");
    const [commentsCount, setCommentsCount] = useState("");
const [searchTerm, setSearchTerm] = useState("");
const [isSearchFocused, setIsSearchFocused] = useState(false);

// Search handler function
const handleSearch = (e) => {
    setSearchTerm(e.target.value);
};

// Clear search function
const clearSearch = () => {
    setSearchTerm("");
};
    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        if (token) {
            const decoded = jwtDecode(token);
            setActiveAdmin(decoded.username);
        }
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await api.get("http://localhost:5000/api/users");
            setUsersCount(res.data);
        } catch (err) {
            console.error("Error fetching users count:", err);
        }
    };

    const fetchMessages = async () => {
        try {
            const res = await api.get("http://localhost:5000/api/messages");
            setMessagesCount(res.data);
        } catch (err) {
            console.error("Error fetching messages count:", err);
        }
    };

    const fetchBookings = async () => {
        try {
            const res = await api.get("http://localhost:5000/api/bookings");
            setBookingsCount(res.data);
        } catch (err) {
            console.error("Error fetching payments count", err);
        }
    };

    const fetchPayments = async () => {
        try {
            const res = await api.get("http://localhost:5000/api/payments");
            setPaymentsCount(res.data);
        } catch (err) {
            console.error("Error fetching Counts!", err);
        }
    };

    const fetchComments = async () => {
        try {
            const res = await api.get("http://localhost:5000/api/testimonials");
            setCommentsCount(res.data);
        } catch (err) {
            console.error("Error fetching Comments count", err);
        }
    };

    useEffect(() => {
        fetchUsers();
        fetchMessages();
        fetchBookings();
        fetchPayments();
        fetchComments();
    }, []);

    const handleTabClick = (tab, fetchFunction) => {
        setActiveTab(tab);
        fetchFunction();
    };

    return (
        <div className="admin-dashboard">
            <div className="mainBoard">
                {/* Header */}
                <div className="headerDiv">
                    <div className="header-left">
                        <button 
                            className="menu-toggle"
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                        >
                            <FontAwesomeIcon icon={faBars} />
                        </button>
                        <h2>Dashboard</h2>
                    </div>
                    
                    <div className="header-center">
                        <h1><span>smarty</span>Grand Admin</h1>
                    </div>

                    <div className="header-right">
                        <div className="header-actions">
                            <button className="icon-btn">
                                <FontAwesomeIcon icon={faSearch} />
                            </button>
                            <button className="icon-btn">
                                <FontAwesomeIcon icon={faBell} />
                                <span className="notification-badge">3</span>
                            </button>
                        </div>
                        <div className="adminDiv">
                            <div className="adminProfile"></div>
                            <div className="admin-info">
                                <p className="admin-name">{activeAdmin}</p>
                                <span className="admin-role">Administrator</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="mainDiv">
                    {/* Sidebar */}
                    <div className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
                        <div className="sidebar-header">
                            <div className="user-welcome">
                                <div className="profile"></div>
                                <div className="welcome-text">
                                    <p>Welcome back,</p>
                                    <p className="admin-name">{activeAdmin}!</p>
                                </div>
                            </div>
                        </div>

                        <nav className="sidebar-nav">
                            <ul>
                                <li 
                                    className={activeTab === "users" ? "active" : ""}
                                    onClick={() => handleTabClick("users", fetchUsers)}
                                >
                                    <FontAwesomeIcon icon={faUsers} />
                                    <span>Users</span>
                                </li>
                                <li 
                                    className={activeTab === "bookings" ? "active" : ""}
                                    onClick={() => handleTabClick("bookings", fetchBookings)}
                                >
                                    <FontAwesomeIcon icon={faCalendarCheck} />
                                    <span>Bookings</span>
                                </li>
                                <li 
                                    className={activeTab === "messages" ? "active" : ""}
                                    onClick={() => handleTabClick("messages", fetchMessages)}
                                >
                                    <FontAwesomeIcon icon={faEnvelope} />
                                    <span>Messages</span>
                                </li>
                                <li 
                                    className={activeTab === "comments" ? "active" : ""}
                                    onClick={() => handleTabClick("comments", fetchComments)}
                                >
                                    <FontAwesomeIcon icon={faCommentDots} />
                                    <span>Testimonials</span>
                                </li>
                            </ul>
                        </nav>

                        <div className="sidebar-footer">
                            <LogoutButton />
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="contentDiv">
                      
                        {/* Stats Cards */}
                        <div className="stats-grid">
                          
                            <div 
                                className={`stat-card ${activeTab === "users" ? "active" : ""}`}
                                onClick={() => handleTabClick("users", fetchUsers)}
                            >
                                <div className="stat-content">
                                    <div className="stat-info">
                                        <h3>{usersCount.length}</h3>
                                        <p>Total Users</p>
                                    </div>
                                    <div className="stat-icon users">
                                        <FontAwesomeIcon icon={faUsers} />
                                    </div>
                                </div>
                                <div className="stat-trend">
                                    <FontAwesomeIcon icon={faChartLine} />
                                    <span>+12% this month</span>
                                </div>
                            </div>

                            <div 
                                className={`stat-card ${activeTab === "messages" ? "active" : ""}`}
                                onClick={() => handleTabClick("messages", fetchMessages)}
                            >
                                <div className="stat-content">
                                    <div className="stat-info">
                                        <h3>{messagesCount.length}</h3>
                                        <p>Messages</p>
                                    </div>
                                    <div className="stat-icon messages">
                                        <FontAwesomeIcon icon={faEnvelope} />
                                    </div>
                                </div>
                                <div className="stat-trend">
                                    <FontAwesomeIcon icon={faChartLine} />
                                    <span>+5% this month</span>
                                </div>
                            </div>

                            <div 
                                className={`stat-card ${activeTab === "bookings" ? "active" : ""}`}
                                onClick={() => handleTabClick("bookings", fetchBookings)}
                            >
                                <div className="stat-content">
                                    <div className="stat-info">
                                        <h3>{bookingsCount.length}</h3>
                                        <p>Bookings</p>
                                    </div>
                                    <div className="stat-icon bookings">
                                        <FontAwesomeIcon icon={faCalendarCheck} />
                                    </div>
                                </div>
                                <div className="stat-trend">
                                    <FontAwesomeIcon icon={faChartLine} />
                                    <span>+18% this month</span>
                                </div>
                            </div>

                            <div 
                                className={`stat-card ${activeTab === "comments" ? "active" : ""}`}
                                onClick={() => handleTabClick("comments", fetchComments)}
                            >
                                <div className="stat-content">
                                    <div className="stat-info">
                                        <h3>{commentsCount.length}</h3>
                                        <p>Testimonials</p>
                                    </div>
                                    <div className="stat-icon testimonials">
                                        <FontAwesomeIcon icon={faCommentDots} />
                                    </div>
                                </div>
                                <div className="stat-trend">
                                    <FontAwesomeIcon icon={faChartLine} />
                                    <span>+8% this month</span>
                                </div>
                            </div>
                        </div>

                        {/* Data Table Area */}
                        <div className="data-section">
    <div className="section-header">
        <div className="section-title-area">
            <h3 className="section-title">
                {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Management
            </h3>
            <p className="section-subtitle">
                Manage and monitor your {activeTab} efficiently
            </p>
        </div>
       
    </div>

    <div className="dbContent">
        {activeTab === "users" && <UsersList searchTerm={searchTerm} />}
        {activeTab === "bookings" && <BookingsList searchTerm={searchTerm} />}
        {activeTab === "payments" && <PaymentsList searchTerm={searchTerm} />}
        {activeTab === "comments" && <CommentsList searchTerm={searchTerm} />} 
        {activeTab === "messages" && <MessagesList searchTerm={searchTerm} />}
    </div>
</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Admin;