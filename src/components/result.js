import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom'; // To get the result data
import { Chart, registerables } from 'chart.js';
import "./result.css";
import './home.css'; // For shared styles like header, footer

// Register necessary Chart.js components
Chart.register(...registerables);

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

function Result() {
    const { state } = useLocation();
    const result = state?.result || {}; // Extract result from location state

    const eegChartRef = useRef(null);
    const attentionPieChartRef = useRef(null);

    useEffect(() => {
        if (eegChartRef.current && attentionPieChartRef.current) {
            const eegChart = new Chart(eegChartRef.current, {
                type: 'line',
                data: {
                    labels: result.eegLabels || [], // Ensure these are provided by your result data
                    datasets: [{
                        label: 'EEG Data Signals',
                        data: result.eegData || [], // Ensure these are provided by your result data
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
                                label: function(context) {
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

            const attentionPieChart = new Chart(attentionPieChartRef.current, {
                type: 'pie',
                data: {
                    labels: ['Low Attention', 'Moderate Attention', 'High Attention'],
                    datasets: [{
                        data: result.attentionData || [], // Ensure these are provided by your result data
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
                                label: function(context) {
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

            return () => {
                eegChart.destroy();
                attentionPieChart.destroy();
            };
        }
    }, [result]);

    return (
        <div>
            <Header />
            <h1>Analysis Results</h1>
            <div className="two-column-layout">
                <div className="left-column">
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
                        {result.highlights || 'No highlights available'}
                    </p>
                </div>
                <div className="highlight-item">
                    <h2 className="highlights-label"><b>Summary</b></h2>
                    <p className="highlights-text">
                        {result.summary || 'No summary available'}
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
            <Footer />
        </div>
    );
}

export default Result;
