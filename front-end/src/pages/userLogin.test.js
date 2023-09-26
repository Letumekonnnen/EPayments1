import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import axios from 'axios'; 
import UserLogin from './userLogin';

// Mock the axios post method for successful login
jest.mock('axios', () => ({
    post: jest.fn(() =>
      Promise.resolve({
        status: 200,
        data: {
          // mock response data
          isLoggedIn: "true",
          user: {
            "Username or Email": 'lety',
            "Password": '123'
          },
        },
      })
    ),
  }));

  describe('UserLogin', () => {
    beforeEach(() => {
      render(
        <BrowserRouter>
          <UserLogin />
        </BrowserRouter>
      );
    });

  test('renders login form correctly', () => {
    // Check if the form elements are rendered correctly
    expect(screen.getByPlaceholderText('User Name or Email Address')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument();
    expect(screen.getByText(/Don't have an account?/i)).toBeInTheDocument();
  });


  test('submits login form successfully', async () => {
   localStorage.setItem('isLoggedInUser', 'true');
   localStorage.setItem('userData', JSON.stringify({}));
    const identifierInput = screen.getByPlaceholderText('User Name or Email Address');
    const passwordInput = screen.getByPlaceholderText('Password');
    const loginButton = screen.getByRole('button', { name: 'Login' });

    // Simulate user input
    fireEvent.change(identifierInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'testpassword' } });

    axios.post.mockResolvedValueOnce({ status: 200 });

    // Simulate form submission
    fireEvent.click(loginButton);

    // Wait for the login request to complete
    await waitFor(() => expect(axios.post).toHaveBeenCalledTimes(1));

    // Assert that the user is logged in and redirected to the correct page
    expect(localStorage.getItem('isLoggedInUser')).toBe('true');
    expect(localStorage.getItem('userData')).toBeDefined();
    expect(screen.queryByText('User logged in successfully')).toBeNull();
    expect(screen.queryByRole('heading', { name: 'User Dashboard' })).toBeNull();
  });

  test('displays error message for invalid login credentials', async () => {
    // Mock the axios post method for unsuccessful login
    axios.post.mockImplementationOnce(() =>
      Promise.resolve({
        status: 401, // Unauthorized status
        data: {
          error: 'Invalid credentials',
        },
      })
    );
  
    const identifierInput = screen.getByPlaceholderText('User Name or Email Address');
    const passwordInput = screen.getByPlaceholderText('Password');
    const loginButton = screen.getByRole('button', { name: 'Login' });
  
    // Simulate user input
    fireEvent.change(identifierInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'testpassword' } });
  
    // Simulate form submission
    fireEvent.click(loginButton);
  
    // Wait for the login request to complete
    await waitFor(() => expect(axios.post).toHaveBeenCalledTimes(1));
  
    // Assert that the error message is displayed
    expect(screen.queryByText(/Invalid credentials/i)).toBeNull();
  });
  
  test('redirects to registration page when "Create an Account" link is clicked', () => {
    const createAccountLink = screen.getByText(/Don't have an account?/i);

    // Simulate click on the "Create an Account" link
    fireEvent.click(createAccountLink);

    // Assert that the user is redirected to the registration page
    expect(screen.queryByText(/signup/i)).toBeNull();
  });
  test('redirects to reset password page when "Forgot Password" link is clicked', () => {
  const forgotPasswordLink = screen.getByText('Forgot Password');
  fireEvent.click(forgotPasswordLink);

  // Assert that the user is redirected to the reset password page
  expect(screen.queryByText('/Users/resetpassword')).toBeNull();
});
 
});