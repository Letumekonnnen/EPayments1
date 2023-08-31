import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import axios from 'axios'; 
import RegistrationForm from './userRegistration';

jest.mock('axios');

describe('RegistrationForm', () => {
  beforeEach(() => {
    render(<RegistrationForm />);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders registration form correctly', () => {
    const formElement = screen.getByTestId('registration-form');
    expect(formElement).toBeInTheDocument();
  });

  test('displays error messages on invalid form submission', async () => {
    const submitButton = screen.getByText('Register');
    fireEvent.click(submitButton);

    await waitFor(() => {
      const firstNameError = screen.getByText('First Name is required');
      const lastNameError = screen.getByText('Last Name is required');
      const genderError = screen.getByText('Gender is required');
      const userNameError = screen.getByText('User name is required');
      const passwordError = screen.getByText('Password is required');
      const confirmPasswordError = screen.getByText('Confirm password is required');
      const emailError = screen.getByText('Email is required');
      const phoneNumberError = screen.getByText('Phone number is required');
      const addressError = screen.getByText('Address is required');

      expect(firstNameError).toBeInTheDocument();
      expect(lastNameError).toBeInTheDocument();
      expect(genderError).toBeInTheDocument();
      expect(userNameError).toBeInTheDocument();
      expect(passwordError).toBeInTheDocument();
      expect(confirmPasswordError).toBeInTheDocument();
      expect(emailError).toBeInTheDocument();
      expect(phoneNumberError).toBeInTheDocument();
      expect(addressError).toBeInTheDocument();
    });
  });

  test('submits form successfully', async () => {
    axios.get.mockResolvedValueOnce({ data: [] });
    axios.post.mockResolvedValueOnce();

    const firstNameInput = screen.getByPlaceholderText('Enter your first name');
    const lastNameInput = screen.getByPlaceholderText('Enter your last name');
    const genderSelect = screen.getByRole('combobox');
    const userNameInput = screen.getByPlaceholderText('Enter your user name');
    const passwordInput = screen.getByPlaceholderText('Enter your password');
    const confirmPasswordInput = screen.getByPlaceholderText('Confirm your password');
    const emailInput = screen.getByPlaceholderText('Enter your email');
    const phoneNumberInput = screen.getByPlaceholderText('Enter your phone number');
    const addressInput = screen.getByPlaceholderText('Enter your address');
    const submitButton = screen.getByText('Register');

    fireEvent.change(firstNameInput, { target: { value: 'John' } });
    fireEvent.change(lastNameInput, { target: { value: 'Doe' } });
    fireEvent.change(genderSelect, { target: { value: 'male' } });
    fireEvent.change(userNameInput, { target: { value: 'johndoe' } });
    fireEvent.change(passwordInput, { target: { value: 'password' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'password' } });
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    fireEvent.change(phoneNumberInput, { target: { value: '+123456789' } });
    fireEvent.change(addressInput, { target: { value: '123 Main St' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith('http://localhost:3000/Users', expect.any(FormData));
      expect(screen.getByText('Registered successfully!')).toBeInTheDocument();
    });
  });

  test('displays error message if user already exists', async () => {
    axios.get.mockResolvedValueOnce({
      data: [
        { Email: 'existinguser@example.com' },
        { Email: 'anotheruser@example.com' },
      ],
    });

    const emailInput = screen.getByPlaceholderText('Enter your email');
    const submitButton = screen.getByText('Register');

    fireEvent.change(emailInput, { target: { value: 'existinguser@example.com' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('User already exists')).toBeInTheDocument();
    });
  });
});