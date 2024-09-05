import React, { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import './result.css';

// Register Chart.js components
Chart.register(...registerables);

const Header = () => (
  <header className="header">
    <nav className="navigation-pill-list" aria-label="Main navigation"></nav>
    <div className="header-auth">
      <button className="cta-button">Get Started</button>
    </div>
  </header>
);

const Footer = () => (
  <footer className="footer">
    <img src="logo.png" alt="Company Logo" className="logo" />
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
