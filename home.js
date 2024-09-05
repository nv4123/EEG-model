import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import './home.css';

const Header = () => {
  return (
    <header className="header">
      {/* Header content */}
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
      {/* Footer content */}
    </footer>
  );
};

const HomePage = () => {
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  const handleFileUpload = (uploadedFile) => {
    setFile(uploadedFile);
  };

  const handleStart = async () => {
    if (file) {
      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await fetch('http://localhost:5000/upload', {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          const result = await response.json();
          navigate('/result', { state: { result } });
        } else {
          alert('Failed to analyze EEG data.');
        }
      } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while uploading the file.');
      }
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
