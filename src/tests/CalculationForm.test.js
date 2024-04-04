import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import CalculationForm from '../components/CalculationForm';

beforeEach(() => {
  // Ensure global.fetch is a mock function before trying to call mockClear on it
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: () => Promise.resolve({ id: 1, expression: '10 * 5', result: '50', status: 'success' }),
  });
});

afterEach(() => {
  // Clear mock after each test
  global.fetch.mockClear();
});

// Mock the onCalculationCreated prop function
const mockOnCalculationCreated = jest.fn();

// Wrap the component with QueryClientProvider for tests
const wrapper = ({ children }) => (
  <QueryClientProvider client={new QueryClient()}>
    {children}
  </QueryClientProvider>
);

describe('CalculationForm', () => {
  it('renders correctly', () => {
    render(<CalculationForm onCalculationCreated={mockOnCalculationCreated} />, { wrapper });
    expect(screen.getByPlaceholderText('Enter calculation')).toBeInTheDocument();
  });

  it('submits a valid calculation expression', async () => {
    render(<CalculationForm onCalculationCreated={mockOnCalculationCreated} />, { wrapper });
    fireEvent.change(screen.getByPlaceholderText('Enter calculation'), { target: { value: '10 * 5' } });
    fireEvent.click(screen.getByRole('button', { name: /calculate/i }));
  
    await waitFor(() => expect(mockOnCalculationCreated).toHaveBeenCalledWith({
      id: expect.any(Number),
      expression: '10 * 5',
      result: '50',
      status: 'success'
    }));
  });
});
