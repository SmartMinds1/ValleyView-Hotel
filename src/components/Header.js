import "./Header.css";
import { Link } from "react-router-dom";
import { React, useState, useEffect, useRef } from "react";
import Modal from "./popUps/Modal";
import SignUp from "../pages/SignUp";
import SignIn from "../pages/SignIn";
import ForgotPassword from "../pages/ForgotPassword";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown, faUser, faSignOutAlt, faShield, faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import { verifyAccessToken } from "../utils/authHelper";

import { useNavigate } from "react-router-dom";

const Header = () => {
  const [showSignUp, setShowSignUp] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false);
  const [showForgotPass, setShowForgotPass] = useState(false);
  const [signUpMessage, setSignUpMessage] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [adminAccessError, setAdminAccessError] = useState("");

  //setting up toggle button to show mobile nav bar
  const [showContent, setShowContent] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleToggle = () => {
    setShowContent((prev) => !prev);
  };

  const handleUserMenuToggle = () => {
    setShowUserMenu((prev) => !prev);
  };

  // Check if user is logged in on component mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const userData = await verifyAccessToken();
      if (userData) {
        // verifyAccessToken returns user data if successful
        setCurrentUser({
          username: userData.username || localStorage.getItem('username'),
          role: userData.role || localStorage.getItem('userRole'),
          email: userData.email || ''
        });
      } else {
        // Check if we have user data in localStorage as fallback
        const username = localStorage.getItem('username');
        if (username) {
          setCurrentUser({
            username: username,
            role: localStorage.getItem('userRole') || 'user',
            email: ''
          });
        }
      }
    } catch (error) {
      console.error("Auth check failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  //hadling switch to signIn
  const handleSwitchToSignIn = (message) => {
    setShowSignUp(false);
    setSignUpMessage(message);
    setShowSignIn(true);
  };

  //hadling switch to signUp
  const handleSwitchToSignUp = () => {
    setShowSignIn(false);
    setShowSignUp(true);
  };

  //hadling switch to forgot password
  const handleSwitchToForgotPassword = () => {
    setShowSignIn(false);
    setShowForgotPass(true);
  };

  const navigate = useNavigate();

  const handleAdminAccess = async () => {
    const isAuthenticated = await verifyAccessToken();

    if (isAuthenticated) {
      // Check if user has admin role
      const userRole = currentUser?.role || localStorage.getItem('userRole');
      
      if (userRole === 'admin') {
        // User is admin, go to dashboard
        navigate("/admin-dashboard");
      } else {
        // User is not admin, show access denied message
        setAdminAccessError("Access denied. Admin privileges required.");
        setTimeout(() => setAdminAccessError(""), 3000); // Clear error after 3 seconds
      }
    } else {
      // Not logged in, show Sign In modal
      setShowSignIn(true);
    }
    setShowUserMenu(false);
    setShowContent(false);
  };

  const handleSignInSuccess = (userData) => {
    // Store user data in localStorage
    if (userData.username) {
      localStorage.setItem('username', userData.username);
    }
    if (userData.role) {
      localStorage.setItem('userRole', userData.role);
    }
    
    setCurrentUser(userData);
    setShowSignIn(false);
    setShowUserMenu(false);
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (token) {
        // Call your logout endpoint
        await fetch('http://localhost:5000/api/auth/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });
      }
    } catch (error) {
      console.error('Logout API call failed:', error);
    } finally {
      // Always clear local storage
      localStorage.removeItem('accessToken');
      localStorage.removeItem('userRole');
      localStorage.removeItem('username');
      
      setCurrentUser(null);
      setShowUserMenu(false);
      navigate("/");
    }
  };

  //animating my header on scroll
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY.current) {
        setIsVisible(false);
        setShowUserMenu(false);
      } else {
        setIsVisible(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.authSection')) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <>
      <div className={`header ${isVisible ? "visible" : "hidden"}`}>
        {/* Admin Access Error Message */}
        {adminAccessError && (
          <div className="admin-access-error">
            <FontAwesomeIcon icon={faExclamationTriangle} />
            <span>{adminAccessError}</span>
          </div>
        )}
        
        <div className="navBar">
          <h1 className="headerTitle">
            <span>Smarty</span>Grand
          </h1>

          <button
            className="dashboard-icon"
            onClick={handleToggle}
            aria-label="Toggle Content"
          >
            {showContent ? <span>✕</span> : <span>&#9776;</span>}
          </button>

          {/*  setting up bar for mobile and tablets */}
          <div>
            {showContent && (
              <div className="mobileNavBar">
                {/* Display user info in mobile nav if logged in */}
                {currentUser && (
                  <div className="mobileUserInfo">
                    <FontAwesomeIcon icon={faUser} className="userIcon" />
                    <span>Welcome, {currentUser.username}</span>
                    {currentUser.role === 'admin' && (
                      <FontAwesomeIcon icon={faShield} className="admin-badge" />
                    )}
                  </div>
                )}

                {/* auth list for mobile */}
                <ul className="mobileAuthNav">
                  {!currentUser ? (
                    <>
                      <li
                        onClick={() => {
                          setShowSignIn(true);
                          setShowContent(false);
                        }}
                      >
                        Sign In
                      </li>
                      <li
                        onClick={() => {
                          setShowSignUp(true);
                          setShowContent(false);
                        }}
                      >
                        Sign Up
                      </li>
                    </>
                  ) : (
                    <>
                      <li className="userWelcome">
                        Welcome, {currentUser.username}
                        {currentUser.role === 'admin' && (
                          <span className="admin-tag"> (Admin)</span>
                        )}
                      </li>
                      <li onClick={handleLogout}>
                        <FontAwesomeIcon icon={faSignOutAlt} /> Logout
                      </li>
                    </>
                  )}
                  <li 
                    className={`linkStyle ${currentUser?.role !== 'admin' ? 'no-access' : ''}`}  
                    onClick={handleAdminAccess}
                  >
                    Admin
                    {currentUser?.role !== 'admin' && (
                      <FontAwesomeIcon icon={faExclamationTriangle} className="access-warning" />
                    )}
                  </li>
                </ul>

                {/* nav list for mobile */}
                <ul className="mobileNavList">
                  <li onClick={() => setShowContent(false)}>
                    <Link className="linkStyle" to="/">
                      Home
                    </Link>
                  </li>
                  <li onClick={() => setShowContent(false)}>
                    <Link className="linkStyle" to="/contact">
                      Contact
                    </Link>
                  </li>
                  <li onClick={() => setShowContent(false)}>
                    <Link className="linkStyle" to="/about">
                      About
                    </Link>
                  </li>
                  <li onClick={() => setShowContent(false)}>
                    <Link className="linkStyle" to="/reservations">
                      Reservation
                    </Link>
                  </li>
                  <li
                    className={`linkStyle ${currentUser?.role !== 'admin' ? 'no-access' : ''}`}
                    onClick={handleAdminAccess}
                  >
                    Admin
                    {currentUser?.role !== 'admin' && (
                      <FontAwesomeIcon icon={faExclamationTriangle} className="access-warning" />
                    )}
                  </li>
                </ul>
              </div>
            )}
          </div>

          {
            <div className="navPages">
              <ul className="navListDesign">
                <li>
                  <Link className="linkStyle" to="/">
                    Home
                  </Link>
                </li>
                <li>
                  <Link className="linkStyle" to="/contact">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link className="linkStyle" to="/about">
                    About
                  </Link>
                </li>
                <li>
                  <Link className="linkStyle" to="/reservations">
                    Reservation
                  </Link>
                </li>
              </ul>
            </div>
          }

          <div className="authSection">
            {isLoading ? (
              <div className="loading-auth">Loading...</div>
            ) : currentUser ? (
              <div className="user-menu-container">
                <div 
                  className="user-welcome" 
                  onClick={handleUserMenuToggle}
                >
                  <FontAwesomeIcon icon={faUser} className="authIcon" />
                  <span className="username">
                    Hi, {currentUser.username}
                    {currentUser.role === 'admin' && (
                      <FontAwesomeIcon icon={faShield} className="admin-badge" />
                    )}
                  </span>
                  <FontAwesomeIcon 
                    icon={faAngleDown} 
                    className={`authDropIcon ${showUserMenu ? 'rotate' : ''}`} 
                  />
                </div>
                
                {showUserMenu && (
                  <ul className="user-menu">
                    <li className="user-info">
                      <strong>
                        {currentUser.username}
                        {currentUser.role === 'admin' && (
                          <FontAwesomeIcon icon={faShield} className="admin-badge" />
                        )}
                      </strong>
                      {currentUser.role && <small>Role: {currentUser.role}</small>}
                    </li>
                    {currentUser.role === 'admin' && (
                      <li 
                        onClick={handleAdminAccess}
                        className="admin-menu-item"
                      >
                        <FontAwesomeIcon icon={faShield} /> Admin Dashboard
                      </li>
                    )}
                    <li onClick={handleLogout}>
                      <FontAwesomeIcon icon={faSignOutAlt} /> Logout
                    </li>
                  </ul>
                )}
              </div>
            ) : (
              <>
                <div className="authIcons" onClick={handleUserMenuToggle}>
                  <FontAwesomeIcon icon={faUser} className="authIcon" />
                  <FontAwesomeIcon icon={faAngleDown} className="authDropIcon" />
                </div>

                <ul className={`auth-links ${showUserMenu ? 'show' : ''}`}>
                  <li
                    onClick={() => {
                      setShowSignIn(true);
                      setShowUserMenu(false);
                    }}
                  >
                    Sign In
                  </li>
                  <li
                    onClick={() => {
                      setShowSignUp(true);
                      setShowUserMenu(false);
                    }}
                  >
                    Sign Up
                  </li>
                  <li 
                    className="linkStyle"  
                    onClick={handleAdminAccess}
                  >
                    Admin
                  </li>
                </ul>
              </>
            )}
          </div>
        </div>
      </div>

      {/* showing login popUp */}
      {showSignIn && (
        <Modal isOpen={showSignIn} onClose={() => setShowSignIn(false)}>
          <SignIn
            signUpResponse={signUpMessage}
            closeSignIn={() => setShowSignIn(false)}
            onForgotPass={() => handleSwitchToForgotPassword()}
            onDontHaveAccount={() => handleSwitchToSignUp()}
            onSignInSuccess={handleSignInSuccess}
          />
        </Modal>
      )}

      {/* showing signUp popUp */}
      {showSignUp && (
        <Modal isOpen={showSignUp} onClose={() => setShowSignUp(false)}>
          <SignUp
            onSuccess={handleSwitchToSignIn}
            closeSignUp={() => setShowSignUp(false)}
          />
        </Modal>
      )}

      {/* showing forgotPassword popUp */}
      {showForgotPass && (
        <Modal isOpen={showForgotPass} onClose={() => setShowForgotPass(false)}>
          <ForgotPassword closeForgotPass={() => setShowForgotPass(false)} />
        </Modal>
      )}
    </>
  );
};

export default Header;