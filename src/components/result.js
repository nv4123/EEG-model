import React, { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import './result.css';
import { Link } from 'react-router-dom'; 

// Register Chart.js components
Chart.register(...registerables);

const Header = () => (
  <header className="header">
      <nav className="nav-pill-list" aria-label="Main navigation">
        <img
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/718d74010e015f5b2985eacee0c8112a06a71aa491f3ac9914051ab266d817bf?placeholderIfAbsent=true&apiKey=e0ff1949bd6d4c81976d269bea4a004f"
          className="logo-image"
          alt="Company logo"
        />
      </nav>
      <div className="header-auth">
      
      <Link to="/home">
  <button className="get-started-btn">Get Started</button>
</Link>      </div>
    </header>
);

const Footer = () => (
  <footer className="footer">
  <img
    src="https://cdn.builder.io/api/v1/image/assets/TEMP/ffb2d290ed4208936aa3bd0673dc7336290cbfe7f85e6e5c7ab8340e8cfb2ab9?placeholderIfAbsent=true&apiKey=e0ff1949bd6d4c81976d269bea4a004f"
    className="footer-image"
    alt="Decorative footer image"
  />
  <div className="footer-section">
    <h2 className="footer-title">Explore</h2>
    <nav aria-label="Footer navigation">
      <a href="/home" className="footer-nav-link">Home</a>
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

const Result = () => {
  const eegChartRef = useRef(null);
  const attentionPieChartRef = useRef(null);
  const eegChartInstance = useRef(null);
  const attentionPieChartInstance = useRef(null);

  useEffect(() => {
    // Destroy existing chart instance before creating a new one
    if (eegChartInstance.current) {
      eegChartInstance.current.destroy();
    }

    if (attentionPieChartInstance.current) {
      attentionPieChartInstance.current.destroy();
    }

    // EEG Line Chart
    if (eegChartRef.current) {
      const ctx = eegChartRef.current.getContext('2d');
      eegChartInstance.current = new Chart(ctx, {
        type: 'line',
        data: {
          labels: ['0s', '1s', '2s', '3s', '4s', '5s'], // Example time labels
          datasets: [{
            label: 'EEG Data Signals',
            data: [10, 25, 60, 80, 55, 90], // Example data
            borderColor: '#36A2EB',
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            fill: true,
            tension: 0.1
          }]
        },
        options: {
          responsive: true,
          plugins: {
            tooltip: {
              callbacks: {
                label: function (context) {
                  let label = context.dataset.label || '';
                  if (context.parsed.y !== null) {
                    let value = context.parsed.y;
                    let attentionLevel = '';

                    if (value < 50) {
                      attentionLevel = 'Low Attention';
                    } else if (value >= 50 && value <= 75) {
                      attentionLevel = 'Moderate Attention';
                    } else {
                      attentionLevel = 'High Attention';
                    }

                    label += ': ' + value + ' - ' + attentionLevel;
                  }
                  return label;
                }
              }
            },
            legend: {
              display: true,
              position: 'top',
            }
          }
        }
      });
    }

    // Attention Pie Chart
    if (attentionPieChartRef.current) {
      const ctx = attentionPieChartRef.current.getContext('2d');
      attentionPieChartInstance.current = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: ['Low Attention', 'Moderate Attention', 'High Attention'],
          datasets: [{
            data: [25, 50, 25], // Example data, adjust as needed
            backgroundColor: ['#FF6384', '#FFCE56', '#36A2EB'],
            hoverBackgroundColor: ['#FF6384', '#FFCE56', '#36A2EB']
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            },
            tooltip: {
              callbacks: {
                label: function (context) {
                  let label = context.label || '';
                  if (context.parsed) {
                    let value = context.parsed;
                    label += ': ' + value + '%';
                  }
                  return label;
                }
              }
            }
          }
        }
      });
    }

    // Cleanup function to destroy charts on unmount
    return () => {
      if (eegChartInstance.current) {
        eegChartInstance.current.destroy();
      }
      if (attentionPieChartInstance.current) {
        attentionPieChartInstance.current.destroy();
      }
    };
  }, []);

  return (
    <div>
      <Header />
      <main className="content-wrapper">
        <div className="two-column-layout">
          <div>
            <canvas ref={eegChartRef} width="400" height="200"></canvas>
          </div>
          <div className="right-column">
            <div className="donut-chart">
              <canvas ref={attentionPieChartRef}></canvas>
            </div>
          </div>
        </div>

        <section className="highlights-section">
          <div className="highlight-item">
            <h2 className="highlights-label"><b>Highlights</b></h2>
            <p className="highlights-text">
              The EEGs were recorded monopolarly using Neurocom EEG 23-channel system.
              The silver/silver chloride electrodes were placed on the scalp according to the International 10/20 scheme.
            </p>
          </div>
          <div className="highlight-item">
            <h2 className="highlights-label"><b>Summary</b></h2>
            <p className="highlights-text">
              A high-pass filter with a 30 Hz cut-off frequency and a power line notch filter (50 Hz) were used.
              All recordings are artifact-free EEG segments of 60 seconds duration.
            </p>
          </div>
          <div className="button-container">
            <button className="download-button">
              <span className="button-content">
                <span className="button-text">Download Report</span>
              </span>
            </button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Result;
