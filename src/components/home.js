import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // For navigation
import './home.css';

const Header = () => {
  return (
    <header className="header">
      <nav className="nav-pill-list" aria-label="Main navigation">
        <img
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/718d74010e015f5b2985eacee0c8112a06a71aa491f3ac9914051ab266d817bf?placeholderIfAbsent=true&apiKey=e0ff1949bd6d4c81976d269bea4a004f"
          className="logo-image"
          alt="Company logo"
        />
      </nav>
      <div className="header-auth">
        <button className="get-started-btn">Get Started</button>
      </div>
    </header>
  );
};

const EEGInputSection = ({ onFileUpload }) => {
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    const uploadedFile = event.target.files[0];
    setFile(uploadedFile);
    onFileUpload(uploadedFile);
  };

  return (
    <div className="eeg-input-container">
      <div className="eeg-input-wrapper">
        <h1 className="eeg-input-title">INPUT YOUR EEG DATA</h1>
        <input
          type="file"
          onChange={handleFileChange}
          aria-label="Upload EEG data file"
          style={{ display: 'none' }}
          id="fileUpload"
        />
        <label htmlFor="fileUpload" className="file-upload-btn">
          File upload
        </label>
      </div>
    </div>
  );
};

const StartButton = ({ onStart }) => {
  return <button className="start-btn" onClick={onStart}>START</button>;
};

const Footer = () => {
  return (
    <footer className="footer">
      <img
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/ffb2d290ed4208936aa3bd0673dc7336290cbfe7f85e6e5c7ab8340e8cfb2ab9?placeholderIfAbsent=true&apiKey=e0ff1949bd6d4c81976d269bea4a004f"
        className="footer-image"
        alt="Decorative footer image"
      />
      <div className="footer-section">
        <h2 className="footer-title">Explore</h2>
        <nav aria-label="Footer navigation">
          <a href="#" className="footer-nav-link">Home</a>
        </nav>
      </div>
      <div className="footer-section">
        <h2 className="footer-title">Developers</h2>
        <p className="footer-developer-name">Diya Goyal</p>
        <p className="footer-developer-name">Aaranay Aadi</p>
        <p className="footer-developer-name">Saumya Gupta</p>
        <p className="footer-developer-name">Nidhi Verma</p>
      </div>
    </footer>
  );
};

const HomePage = () => {
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  const handleFileUpload = (uploadedFile) => {
    setFile(uploadedFile);
  };

  const handleStart = () => {
    if (file) {
      // Navigate to the result page
      navigate('/result');
    } else {
      alert('Please upload a file before starting the analysis.');
    }
  };

  return (
    <div className="home-container">
      <Header />
      <main className="content-wrapper">
        <EEGInputSection onFileUpload={handleFileUpload} />
        <StartButton onStart={handleStart} />
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;
