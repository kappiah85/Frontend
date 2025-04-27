import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../components/Header';

// Add styles for status badges
const styles = `
  .status-badge {
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 0.9em;
    font-weight: 500;
    text-transform: capitalize;
  }
  
  .status-badge.status-pending {
    background-color: #fff3cd;
    color: #856404;
  }
  
  .status-badge.status-approved {
    background-color: #d4edda;
    color: #155724;
  }
  
  .status-badge.status-rejected {
    background-color: #f8d7da;
    color: #721c24;
  }
  
  .application-card {
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 16px;
    margin-bottom: 16px;
    background-color: white;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }
  
  .application-card h4 {
    margin-top: 0;
    color: #333;
  }
  
  .application-card p {
    margin: 8px 0;
  }
  
  .btn-primary, .btn-secondary {
    padding: 8px 16px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-weight: 500;
    margin-top: 8px;
  }
  
  .btn-primary {
    background-color: #007bff;
    color: white;
  }
  
  .btn-secondary {
    background-color: #6c757d;
    color: white;
  }
`;

const StudentDashboard = () => {
  const [student, setStudent] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch student applications
  const fetchApplications = async (studentId) => {
    try {
      const response = await axios.get(`http://localhost:3000/api/applications`);
      // Filter applications for the current student
      const studentApplications = response.data.filter(app => app.studentId === parseInt(studentId));
      setApplications(studentApplications);
    } catch (err) {
      setError('Failed to load applications');
      console.error(err);
    }
  };

  useEffect(() => {
    // Get the current user from localStorage
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    if (!currentUser) {
      setError('Please login to view your dashboard');
      setLoading(false);
      return;
    }

    // Set student data from current user
    setStudent(currentUser);

    // Fetch applications
    fetchApplications(currentUser.id);

    // Set up an interval to refresh applications every 30 seconds
    const intervalId = setInterval(() => {
      fetchApplications(currentUser.id);
    }, 30000);

    setLoading(false);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  if (loading) {
    return (
      <>
        <Header />
        <div className="container">
          <p>Loading...</p>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <div className="container">
          <div className="error-message">{error}</div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="container">
        <h2>Student Dashboard</h2>
        
        {student && (
          <div className="profile-section">
            <h3>Profile Information</h3>
            <div className="profile-details">
              <p><strong>Name:</strong> {student.name}</p>
              <p><strong>Email:</strong> {student.email}</p>
              <p><strong>Student ID:</strong> {student.studentId}</p>
              <p><strong>Phone:</strong> {student.phone}</p>
              <p><strong>Address:</strong> {student.address}</p>
            </div>
          </div>
        )}

        <div className="applications-section">
          <h3>Your Applications</h3>
          {applications.length === 0 ? (
            <p>You haven't submitted any applications yet.</p>
          ) : (
            <div className="applications-list">
              {applications.map(app => (
                <div key={app.id} className="application-card">
                  <h4>Application #{app.id}</h4>
                  <p><strong>Room Type:</strong> {app.preferences?.roomType || 'Not specified'}</p>
                  <p><strong>Building:</strong> {app.preferences?.building || 'Not specified'}</p>
                  <p><strong>Status:</strong> 
                    <span className={`status-badge status-${app.status.toLowerCase()}`}>
                      {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                    </span>
                  </p>
                  <p><strong>Submitted:</strong> {new Date(app.submittedAt).toLocaleString()}</p>
                  {app.processedAt && (
                    <p><strong>Processed:</strong> {new Date(app.processedAt).toLocaleString()}</p>
                  )}
                  {app.status === 'pending' && (
                    <button className="btn-secondary">Cancel Application</button>
                  )}
                </div>
              ))}
            </div>
          )}
          <button className="btn-primary">Apply for Housing</button>
        </div>
      </div>

      <style jsx>{`
        .status-badge {
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 0.9em;
          font-weight: 500;
          text-transform: capitalize;
        }
        
        .status-badge.status-pending {
          background-color: #fff3cd;
          color: #856404;
        }
        
        .status-badge.status-approved {
          background-color: #d4edda;
          color: #155724;
        }
        
        .status-badge.status-rejected {
          background-color: #f8d7da;
          color: #721c24;
        }
        
        .application-card {
          border: 1px solid #ddd;
          border-radius: 8px;
          padding: 16px;
          margin-bottom: 16px;
          background-color: white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .application-card h4 {
          margin-top: 0;
          color: #333;
        }
        
        .application-card p {
          margin: 8px 0;
        }
        
        .btn-primary, .btn-secondary {
          padding: 8px 16px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 500;
          margin-top: 8px;
        }
        
        .btn-primary {
          background-color: #007bff;
          color: white;
        }
        
        .btn-secondary {
          background-color: #6c757d;
          color: white;
        }
      `}</style>
    </>
  );
};

export default StudentDashboard;