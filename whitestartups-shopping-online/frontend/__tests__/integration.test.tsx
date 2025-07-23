import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../App'; // Adjust the import based on your app structure
import { fetchHealthCheck } from '../api'; // Adjust the import based on your api structure

jest.mock('../api');

describe('Frontend Integration Tests', () => {
  test('Frontend Health Check', async () => {
    fetchHealthCheck.mockResolvedValueOnce({ status: 'ok' });

    render(<App />);

    const healthCheckMessage = await screen.findByText(/health check passed/i);
    expect(healthCheckMessage).toBeInTheDocument();
  });

  test('renders main components', () => {
    render(<App />);
    const mainElement = screen.getByText(/welcome to the e-commerce platform/i);
    expect(mainElement).toBeInTheDocument();
  });
});