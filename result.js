import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom'; 
import { Chart, registerables } from 'chart.js';
import './result.css';
import './home.css'; 

Chart.register(...registerables);

const Header = () => {
  return (
    <header className="header">
      {/* Header content */}
    </header>
  );
};

const Footer = () => {
  return (
    <footer className="footer">
      {/* Footer content */}
    </footer>
  );
};

function Result() {
  const { state } = useLocation();
  const result = state?.result || {};

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
              {/* Display EEG graph image */}
              <img src={`data:image/png;base64,${result.image}`} alt="EEG Graph" />
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