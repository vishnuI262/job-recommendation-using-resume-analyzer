import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import './HomePage.css';

const HomePage = () => {
    useEffect(() => {
        const timer = setTimeout(() => {
            console.log("Animation completed");
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="home-page">
            {/* Header Section */}
            <header className="header">
                <Link to="/" className="logo">ResumeAnalyzer</Link>
                <nav className="nav-buttons">
                    <Link to="/about" className="nav-button">About</Link>
                    <Link to="/contact" className="nav-button">Contact</Link>
                    <Link to="/pricing" className="nav-button">Pricing</Link>
                </nav>
            </header>

            {/* Hero Section */}
            <section className="hero">
                <motion.h1
                    className="hero-title"
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                >
                    Unlock Your Career Potential
                </motion.h1>
                <motion.p
                    className="hero-description"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 0.5 }}
                >
                    Get personalized job recommendations based on your resume.
                </motion.p>
                <motion.div
                    className="hero-buttons"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 0.7 }}
                >
                    <Link to="/login" className="hero-button">Log-in</Link>
                    <Link to="/signup" className="hero-button">Sign Up</Link>
                </motion.div>
            </section>

            {/* Features Section */}
            <section className="features">
                <h2 className="features-title">Key Features</h2>
                <div className="feature-cards">
                    <div className="feature-card">
                        <h3>AI-Driven Analysis</h3>
                        <p>Our advanced AI algorithms analyze your resume to identify key skills and experience.</p>
                    </div>
                    <div className="feature-card">
                        <h3>Personalized Recommendations</h3>
                        <p>Receive job recommendations tailored to your unique profile and career goals.</p>
                    </div>
                    <div className="feature-card">
                        <h3>Instant Results</h3>
                        <p>Get immediate feedback and suggestions to improve your resume and job search strategy.</p>
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="testimonials">
                <h2 className="testimonials-title">What Our Users Say</h2>
                <div className="testimonial-cards">
                    <div className="testimonial-card">
                        <blockquote>
                            "The Resume Analyzer website works fine. It's user-friendly and easy to navigate. I highly recommend it!"
                        </blockquote>
                        <cite>- Sriram R, AI Student</cite>
                    </div>
                    <div className="testimonial-card">
                        <blockquote>
                            "The Resume Analyzer website works good. It analyzes the resumes and gives me good results. I'm satisfied with it."
                        </blockquote>
                        <cite>- Ajay C, AI Student</cite>
                    </div>
                </div>
            </section>

            {/* Footer Section */}
            <footer className="footer">
                <p>&copy; 2025 ResumeAnalyzer. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default HomePage;
