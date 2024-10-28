import React, { useEffect, useState } from 'react';
import {
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CButton,
  CForm,
  CFormInput,
  CFormSelect,
  CInputGroup,
  CInputGroupText,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
} from '@coreui/react';
import { cilPen, cilTrash } from '@coreui/icons';
import CIcon from '@coreui/icons-react';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    userType: 'User', // Default to User
  });
  const [editModalVisible, setEditModalVisible] = useState(false); // Modal visibility state
  const [editingUser, setEditingUser] = useState(null); // State for editing user

  // Fetch user and admin data from the API
  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/auth/users'); // Replace with your API endpoint
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Function to handle delete user action
  const handleDeleteUser = async (userId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this user?');
    if (confirmDelete) {
      try {
        const response = await fetch(`http://localhost:8000/api/auth/users/${userId}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          fetchUsers(); // Refresh the user list after deletion
        } else {
          alert('Failed to delete user');
        }
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  // Function to handle opening the edit modal
  const handleEditUser = (user) => {
    setEditingUser(user); // Set the selected user for editing
    setEditModalVisible(true); // Show the modal
  };

  // Function to handle form input changes for new user or editing user
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (editingUser) {
      setEditingUser({
        ...editingUser,
        [name]: value,
      });
    } else {
      setNewUser({
        ...newUser,
        [name]: value,
      });
    }
  };

  // Function to handle user update
  const handleUpdateUser = async () => {
    console.log(editingUser)
    try {
      const response = await fetch(`http://localhost:8000/api/auth/users/${editingUser._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingUser),
      });

      if (response.ok) {
        alert('User updated successfully!');
        setEditModalVisible(false); // Close the modal
        fetchUsers(); // Refresh the user list after updating
      } else {
        const result = await response.json();
        alert(`Error: ${result.message}`);
      }
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Failed to update user. Please try again later.');
    }
  };

  // Function to handle user registration (Adding new user)
  const handleAddUser = async (e) => {
    e.preventDefault();

    if (newUser.password !== newUser.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/api/auth/createUserOrAdmin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      });

      if (response.ok) {
        alert('User added successfully!');
        setNewUser({ username: '', email: '', password: '', confirmPassword: '', userType: 'User' });
        fetchUsers(); // Refresh the user list after adding a new user
      } else {
        const result = await response.json();
        alert(`Error: ${result.message}`);
      }
    } catch (error) {
      console.error('Error adding user:', error);
      alert('Failed to add user. Please try again later.');
    }
  };

  return (
    <>
      <h1>User Management</h1>

      {/* User Registration Form */}
      <CForm onSubmit={handleAddUser} className="mb-4">
        <CInputGroup className="mb-3">
          <CInputGroupText>Username</CInputGroupText>
          <CFormInput
            type="text"
            name="username"
            value={newUser.username}
            onChange={handleInputChange}
            required
          />
        </CInputGroup>
        <CInputGroup className="mb-3">
          <CInputGroupText>Email</CInputGroupText>
          <CFormInput
            type="email"
            name="email"
            value={newUser.email}
            onChange={handleInputChange}
            required
          />
        </CInputGroup>
        <CInputGroup className="mb-3">
          <CInputGroupText>Password</CInputGroupText>
          <CFormInput
            type="password"
            name="password"
            value={newUser.password}
            onChange={handleInputChange}
            required
          />
        </CInputGroup>
        <CInputGroup className="mb-4">
          <CInputGroupText>Confirm Password</CInputGroupText>
          <CFormInput
            type="password"
            name="confirmPassword"
            value={newUser.confirmPassword}
            onChange={handleInputChange}
            required
          />
        </CInputGroup>

        {/* User Type Selection */}
        <CInputGroup className="mb-4">
          <CInputGroupText>User Type</CInputGroupText>
          <CFormSelect name="userType" value={newUser.userType} onChange={handleInputChange}>
            <option value="User">User</option>
            <option value="Admin">Admin</option>
          </CFormSelect>
        </CInputGroup>

        <CButton type="submit" color="primary">Add {newUser.userType}</CButton>
      </CForm>

      {/* Users Table */}
      <CTable>
        <CTableHead color="light">
          <CTableRow>
            <CTableHeaderCell scope="col">#</CTableHeaderCell>
            <CTableHeaderCell scope="col">Username</CTableHeaderCell>
            <CTableHeaderCell scope="col">User Type</CTableHeaderCell>
            <CTableHeaderCell scope="col">Email</CTableHeaderCell>
            <CTableHeaderCell scope="col">Registered At</CTableHeaderCell>
            <CTableHeaderCell scope="col">Actions</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {users.length > 0 ? (
            users.map((user, index) => (
              <CTableRow key={user._id}>
                <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                <CTableDataCell>{user.username}</CTableDataCell>
                <CTableDataCell>{user.role || 'User'}</CTableDataCell>
                <CTableDataCell>{user.email}</CTableDataCell>
                <CTableDataCell>{new Date(user.createdAt).toLocaleString()}</CTableDataCell>
                <CTableDataCell>
                  <CButton 
                    color="info" 
                    onClick={() => handleEditUser(user)} 
                    className="me-2"
                    size="sm"
                  >
                    <CIcon icon={cilPen} /> Edit
                  </CButton>
                  <CButton 
                    color="danger" 
                    size="sm"
                    onClick={() => handleDeleteUser(user._id)}
                  >
                    <CIcon icon={cilTrash} /> Delete
                  </CButton>
                </CTableDataCell>
              </CTableRow>
            ))
          ) : (
            <CTableRow>
              <CTableDataCell colSpan="6" className="text-center">
                No users found.
              </CTableDataCell>
            </CTableRow>
          )}
        </CTableBody>
      </CTable>

      {/* Edit User Modal */}
      {editingUser && (
        <CModal visible={editModalVisible} onClose={() => setEditModalVisible(false)}>
          <CModalHeader>
            <CModalTitle>Edit User</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <CInputGroup className="mb-3">
              <CInputGroupText>Username</CInputGroupText>
              <CFormInput
                type="text"
                name="username"
                value={editingUser.username}
                onChange={handleInputChange}
                required
              />
            </CInputGroup>
            <CInputGroup className="mb-3">
              <CInputGroupText>Email</CInputGroupText>
              <CFormInput
                type="email"
                name="email"
                value={editingUser.email}
                onChange={handleInputChange}
                required
              />
            </CInputGroup>
            <CInputGroup className="mb-4">
              <CInputGroupText>User Type</CInputGroupText>
              <CFormSelect name="userType" value={editingUser.role || 'User'} onChange={handleInputChange}>
                <option value="User">User</option>
                <option value="Admin">Admin</option>
              </CFormSelect>
            </CInputGroup>
          </CModalBody>
          <CModalFooter>
            <CButton color="primary" onClick={handleUpdateUser}>Update User</CButton>
            <CButton color="secondary" onClick={() => setEditModalVisible(false)}>Cancel</CButton>
          </CModalFooter>
        </CModal>
      )}
    </>
  );
};

export default UserManagement;
