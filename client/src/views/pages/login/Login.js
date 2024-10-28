import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
  CFormSelect,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilLockLocked, cilUser } from '@coreui/icons';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
  const navigate = useNavigate(); // Initialize useNavigate hook for redirection

  // State to store form inputs
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    userType: 'User', // Default to User
  });

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const { email, password, userType } = formData;

    // Define the API URL based on user type
    const apiUrl =
      userType === 'Admin'
        ? 'http://localhost:8000/api/auth/admin/signin'
        : 'http://localhost:8000/api/auth/user/signin';

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (response.ok) {
        // Store the correct user type (User or Admin) in localStorage
        if (userType === 'Admin') {
          localStorage.setItem('admin', JSON.stringify(result.admin));
          toast.success(result.successMsg, {
            position: 'top-right',
            autoClose: 3000,
          });
          navigate('/dashboard'); // Redirect to Admin Dashboard
        } else {
          localStorage.setItem('user', JSON.stringify(result.user));
          toast.success(result.successMsg, {
            position: 'top-right',
            autoClose: 3000,
          });
          navigate('/user-dashboard'); // Redirect to User Dashboard
        }
      } else {
        toast.error(`Error: ${result.message}`, {
          position: 'top-right',
          autoClose: 3000,
        });
      }
    } catch (error) {
      console.error('Error signing in:', error);
      toast.error('Failed to sign in. Please try again later.', {
        position: 'top-right',
        autoClose: 3000,
      });
    }
  };

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <ToastContainer /> {/* Toastify container for notifications */}
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={8}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm onSubmit={handleSubmit}>
                    <h1>Login</h1>
                    <p className="text-body-secondary">Sign In to your account</p>

                    {/* User Type Selection */}
                    <CInputGroup className="mb-3">
                      <CInputGroupText>User Type</CInputGroupText>
                      <CFormSelect
                        name="userType"
                        value={formData.userType}
                        onChange={handleInputChange}
                      >
                        <option value="User">User</option>
                        <option value="Admin">Admin</option>
                      </CFormSelect>
                    </CInputGroup>

                    {/* Email Input */}
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput
                        type="email"
                        name="email"
                        placeholder="Email"
                        autoComplete="username"
                        value={formData.email}
                        onChange={handleInputChange}
                      />
                    </CInputGroup>

                    {/* Password Input */}
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type="password"
                        name="password"
                        placeholder="Password"
                        autoComplete="current-password"
                        value={formData.password}
                        onChange={handleInputChange}
                      />
                    </CInputGroup>

                    <CRow>
                      <CCol xs={6}>
                        <CButton color="primary" className="px-4" type="submit">
                          Login
                        </CButton>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
              <CCard className="text-white bg-primary py-5" style={{ width: '44%' }}>
                <CCardBody className="text-center">
                  <div>
                    <h2>Sign Up</h2>
                    <p>
                      Not registered yet? Sign up as an Admin or User! Upload datasets, analyze, and
                      predict with ease. Get Statistics about malware types, threats detected, FAQ &
                      much more.
                    </p>
                    <Link to="/register">
                      <CButton color="primary" className="mt-3" active tabIndex={-1}>
                        Register Now!
                      </CButton>
                    </Link>
                  </div>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  );
};

export default Login;
