import React, { useState, useEffect } from 'react';

const TrainingAndResources = () => {
  return (
    <div style={{ padding: '20px' }}>
      <h1>User Training & Resources</h1>
      <p>
        Welcome to the User Training & Resources page! Here, you will find a wealth of information to help you
        understand URL safety, how to utilize our application, and improve your cybersecurity skills.
      </p>
      
      {/* Tutorials Section */}
      <section className="tutorials">
        <h3>Tutorials</h3>
        <ul>
          <li><a href="#tutorial1">How to Analyze a URL</a></li>
          <li><a href="#tutorial2">Understanding Prediction Results</a></li>
          <li><a href="#tutorial3">How to Submit Feedback</a></li>
          <li><a href="#tutorial4">Navigating the User Dashboard</a></li>
        </ul>

        <div id="tutorial1">
          <h4>How to Analyze a URL</h4>
          <p>Follow these steps to analyze a URL using our application:</p>
          <ol>
            <li>Log in to your account.</li>
            <li>Navigate to the User Dashboard.</li>
            <li>Enter the URL you want to analyze in the input field.</li>
            <li>Click on the "Analyze URL" button.</li>
            <li>Review the prediction results displayed on the screen.</li>
          </ol>
        </div>

        <div id="tutorial2">
          <h4>Understanding Prediction Results</h4>
          <p>Here's how to interpret the prediction results:</p>
          <ul>
            <li><strong>Benign:</strong> The URL is safe.</li>
            <li><strong>Malware:</strong> The URL is harmful and may contain viruses.</li>
            <li><strong>Phishing:</strong> The URL is attempting to trick you into providing personal information.</li>
          </ul>
        </div>

        <div id="tutorial3">
          <h4>How to Submit Feedback</h4>
          <p>To submit your feedback:</p>
          <ol>
            <li>Navigate to the Feedback section.</li>
            <li>Select a star rating for your experience.</li>
            <li>Enter your feedback in the text area provided.</li>
            <li>Click on the "Submit Feedback" button.</li>
          </ol>
        </div>

        <div id="tutorial4">
          <h4>Navigating the User Dashboard</h4>
          <p>Learn how to make the most of your User Dashboard:</p>
          <ul>
            <li>Access prediction results and statistics.</li>
            <li>Submit URLs for analysis directly from the dashboard.</li>
            <li>View your activity history and submitted feedback.</li>
          </ul>
        </div>
      </section>

      {/* Resources Section */}
      <section className="resources">
        <h3>Resources</h3>
        <ul>
          <li>
            <a href="https://www.cyber.gov.au/acsc/view-all-content/publications/understanding-cybersecurity" target="_blank" rel="noopener noreferrer">
              Understanding Cybersecurity
            </a>
            <p>A comprehensive guide from the Australian Cyber Security Centre on understanding cybersecurity basics.</p>
          </li>
          <li>
            <a href="https://www.cisa.gov/publications-library" target="_blank" rel="noopener noreferrer">
              CISA Publications
            </a>
            <p>Publications and resources from the Cybersecurity and Infrastructure Security Agency.</p>
          </li>
          <li>
            <a href="https://owasp.org/www-project-top-ten/" target="_blank" rel="noopener noreferrer">
              OWASP Top Ten
            </a>
            <p>Learn about the top ten web application security risks and how to mitigate them.</p>
          </li>
        </ul>
      </section>

      {/* FAQ Section */}
      <section className="faqs">
        <h3>Frequently Asked Questions</h3>
        <div>
          <h4>What is URL analysis?</h4>
          <p>URL analysis is the process of examining a URL to determine if it is safe or potentially harmful.</p>
        </div>
        <div>
          <h4>How does the prediction work?</h4>
          <p>Our system uses machine learning algorithms to analyze URLs and provide predictions based on known patterns.</p>
        </div>
      </section>

      {/* Conclusion Section */}
      <section className="conclusion">
        <h3>Thank You!</h3>
        <p>Thank you for visiting the User Training & Resources page. If you have any questions or need further assistance, feel free to contact our support team.</p>
      </section>
    </div>
  );
};

export default TrainingAndResources;
