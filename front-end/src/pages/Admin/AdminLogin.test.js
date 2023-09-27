import React from 'react';
import { message } from 'antd';
import { BrowserRouter } from 'react-router-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AdminLogin from './AdminLogin';

describe('AdminLogin', () => {
  test('should handle form submission', async () => {
    render(
      <BrowserRouter>
        <AdminLogin />
      </BrowserRouter>
    );
    // Debug statement
  screen.debug();


    // Mock the fetch request
    const mockFetch = jest.spyOn(global, 'fetch').mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ token: 'mockToken', user: { id: 123 } }),
      })
    );

    // Fill in the form inputs
    fireEvent.change(screen.getByPlaceholderText('Username or Email'), {
      target: { value: 'admin' },
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'password' },
    });

    // Click the login button
    fireEvent.click(screen.getByRole('button', { name: 'Login' }));

    // Wait for the form submission to complete
    await waitFor(() => expect(mockFetch).toHaveBeenCalledTimes(1));

    // Verify the localStorage items
    expect(localStorage.getItem('adminToken')).toBe('mockToken');
    expect(localStorage.getItem('adminData')).toBe('{"id":123}');

    // Verify the navigation
    expect(screen.queryByText('Admin logged in successfully')).toBeNull();

    // Restore the original fetch implementation
    mockFetch.mockRestore();
  });

  test('should display error message for failed login', async () => {
    // Mock the fetch request to simulate a failed login
    const mockFetch = jest
      .spyOn(global, 'fetch')
      .mockImplementation(() =>
        Promise.resolve({
          ok: false,
          json: () => Promise.resolve({ error: 'Invalid credentials' }),
        })
      );

    // Mock the message.error function
    const messageErrorMock = jest.spyOn(message, 'error');

    // Fill in the form inputs
    fireEvent.change(screen.getByPlaceholderText('Username or Email'), {
      target: { value: 'admin' },
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'password' },
    });

    // Click the login button
    fireEvent.click(screen.getByRole('button', { name: 'Login' }));

    // Wait for the form submission to complete
    await waitFor(() => expect(mockFetch).toHaveBeenCalledTimes(1));

    // Verify error message is displayed
    expect(messageErrorMock).toHaveBeenCalledTimes(1);
    expect(messageErrorMock).toHaveBeenCalledWith('Admin login failed');
    expect(messageErrorMock).toHaveBeenCalledWith('insert valid UserName and Password');

    // Verify no navigation occurred
    expect(screen.queryByText('Admin logged in successfully')).toBeNull();

    // Restore the original fetch and message.error implementations
    mockFetch.mockRestore();
    messageErrorMock.mockRestore();
  });
});