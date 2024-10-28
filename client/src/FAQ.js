import React, { useState, useEffect } from 'react';
import {
  CCard,
  CCardBody,
  CCardHeader,
  CForm,
  CFormTextarea,
  CButton,
  CInputGroup,
  CFormInput,
  CRow,
  CCol
} from '@coreui/react';
import { toast } from 'react-toastify';

const FAQ = () => {
  const [question, setQuestion] = useState(''); // User input for new question
  const [faqList, setFaqList] = useState([]); // List of FAQs from the backend
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState(''); // Search query for filtering

  // Fetch all FAQs on component mount
  useEffect(() => {
    fetchFAQs();
  }, []);

  const fetchFAQs = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/faq');
      const data = await response.json();

      if (response.ok) {
        setFaqList(data);
      } else {
        toast.error('Failed to fetch FAQs');
      }
    } catch (error) {
      console.error('Error fetching FAQs:', error);
      toast.error('An error occurred while fetching FAQs');
    }
    setLoading(false);
  };

  // Handle form submission to add a new question
  const handleAddQuestion = async (e) => {
    e.preventDefault();

    if (!question) {
      toast.error('Please enter a question');
      return;
    }

    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const response = await fetch('http://localhost:8000/faq/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question, userId: user._id }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Question submitted successfully!');
        setQuestion(''); // Reset the question input
        fetchFAQs(); // Refresh the list of FAQs
      } else {
        toast.error('Failed to submit the question');
      }
    } catch (error) {
      console.error('Error submitting question:', error);
      toast.error('An error occurred while submitting the question');
    }
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Filter FAQs based on search query
  const filteredFaqs = faqList.filter((faq) =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ padding: '20px' }}>
      <h1>FAQ</h1>

      {/* Form to Submit a New Question */}
      <CCard className="mb-4">
        <CCardHeader>Ask a Question</CCardHeader>
        <CCardBody>
          <CForm onSubmit={handleAddQuestion}>
            <CFormTextarea
              placeholder="Enter your question here..."
              rows="4"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              required
            />
            <CButton type="submit" color="primary" className="mt-3">
              Submit Question
            </CButton>
          </CForm>
        </CCardBody>
      </CCard>

      {/* Search Bar */}
      <CInputGroup className="mb-4">
        <CFormInput
          type="text"
          placeholder="Search for FAQs..."
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </CInputGroup>

      {/* List of FAQs */}
      <CCard className="mb-4">
        <CCardHeader>Frequently Asked Questions</CCardHeader>
        <CCardBody>
          {loading && <p>Loading FAQs...</p>}
          {filteredFaqs.length === 0 && !loading && <p>No FAQs found.</p>}
          {filteredFaqs.map((faq, index) => (
            <div key={faq._id} style={{ marginBottom: '20px' }}>
              <h5>Q{index + 1}: {faq.question}</h5>
              {faq.answer ? <p>A: {faq.answer}</p> : <p style={{ color: 'gray' }}>This question has not been answered yet.</p>}
              <div>
                <CButton
                  color="success"
                  size="sm"
                  onClick={async () => {
                    // Handle upvote
                    await fetch(`http://localhost:8000/faq/vote/${faq._id}`, {
                      method: 'PUT',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ voteType: 'upvote' }),
                    });
                    fetchFAQs(); // Refresh the list
                  }}
                >
                  Upvote ({faq.upvotes})
                </CButton>
                <CButton
                  color="danger"
                  size="sm"
                  className="ms-2"
                  onClick={async () => {
                    // Handle downvote
                    await fetch(`http://localhost:8000/faq/vote/${faq._id}`, {
                      method: 'PUT',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ voteType: 'downvote' }),
                    });
                    fetchFAQs(); // Refresh the list
                  }}
                >
                  Downvote ({faq.downvotes})
                </CButton>
              </div>
            </div>
          ))}
        </CCardBody>
      </CCard>
    </div>
  );
};

export default FAQ;
