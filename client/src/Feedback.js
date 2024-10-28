import React, { useState, useEffect } from 'react';
import ReactStars from 'react-rating-stars-component';
import { CButton, CCard, CCardBody, CCardHeader, CFormTextarea, CListGroup, CListGroupItem } from '@coreui/react';
import { toast } from 'react-toastify';

const Feedback = () => {
  const [feedback, setFeedback] = useState(''); // State for feedback text
  const [rating, setRating] = useState(0); // State for star rating
  const [feedbackList, setFeedbackList] = useState([]); // State for list of feedbacks
  const [loading, setLoading] = useState(true); // Loading state for feedback list

  // Fetch feedbacks from the database
  const fetchFeedbacks = async () => {
    try {
      const response = await fetch('http://localhost:8000/feedbacks'); // Adjust endpoint as needed
      const data = await response.json();

      if (response.ok) {
        setFeedbackList(data); // Store fetched feedbacks in state
      } else {
        toast.error('Failed to load feedbacks.');
      }
    } catch (error) {
      console.error('Error fetching feedbacks:', error);
      toast.error('An error occurred while fetching feedbacks.');
    } finally {
      setLoading(false);
    }
  };

  // Handle feedback submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!feedback || rating === 0) {
      toast.error('Please provide your feedback and select a rating.');
      return;
    }

    const user = JSON.parse(localStorage.getItem('user')); // Get user from local storage

    const feedbackData = {
      userId: user._id,
      username: user.username,
      feedback,
      rating,
    };

    try {
      const response = await fetch('http://localhost:8000/feedbacks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(feedbackData),
      });

      if (response.ok) {
        toast.success('Feedback submitted successfully!');
        setFeedback(''); // Reset feedback input
        setRating(0); // Reset rating
        fetchFeedbacks(); // Refresh feedback list
      } else {
        const errorData = await response.json();
        toast.error(`Error submitting feedback: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast.error('An error occurred while submitting feedback.');
    }
  };

  // Use effect to fetch feedbacks when component mounts
  useEffect(() => {
    fetchFeedbacks();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Feedback</h1>
      <CCard>
        <CCardHeader>We value your feedback!</CCardHeader>
        <CCardBody>
          <form onSubmit={handleSubmit}>
            <ReactStars
              count={5}
              onChange={setRating}
              size={24}
              activeColor="#ffd700"
              value={rating}
              isHalf={false} // Set to true if you want half-star ratings
            />
            <CFormTextarea
              placeholder="Enter your feedback here..."
              rows={4}
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              style={{ marginTop: '10px' }}
            />
            <CButton type="submit" color="success" className="mt-3">
              Submit Feedback
            </CButton>
          </form>
        </CCardBody>
      </CCard>

      {/* Displaying Feedback List */}
      <CCard className="mt-4">
        <CCardHeader>User Feedbacks</CCardHeader>
        <CCardBody>
          {loading ? (
            <p>Loading feedbacks...</p>
          ) : (
            <CListGroup>
              {feedbackList.map((item, index) => (
                <CListGroupItem key={index}>
                  <ReactStars
                    count={5}
                    value={item.rating} // Displaying the stored rating
                    edit={false} // Disable editing
                    size={24}
                    activeColor="#ffd700"
                  />
                  <p><strong>{item.username}</strong> <em>({new Date(item.createdAt).toLocaleString()})</em></p>
                  <p>{item.feedback}</p>
                </CListGroupItem>
              ))}
            </CListGroup>
          )}
        </CCardBody>
      </CCard>
    </div>
  );
};

export default Feedback;
