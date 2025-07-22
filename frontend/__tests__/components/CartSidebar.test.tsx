import React from 'react';
import { render, screen } from '@testing-library/react';
import CartSidebar from '../../components/CartSidebar';

test('renders CartSidebar component', () => {
    render(<CartSidebar />);
    const linkElement = screen.getByText(/cart/i);
    expect(linkElement).toBeInTheDocument();
});

test('displays correct item count', () => {
    const items = [{ id: 1, name: 'Item 1' }, { id: 2, name: 'Item 2' }];
    render(<CartSidebar items={items} />);
    const itemCount = screen.getByText(/2 items/i);
    expect(itemCount).toBeInTheDocument();
});

test('calls checkout function when checkout button is clicked', () => {
    const mockCheckout = jest.fn();
    render(<CartSidebar onCheckout={mockCheckout} />);
    const buttonElement = screen.getByRole('button', { name: /checkout/i });
    buttonElement.click();
    expect(mockCheckout).toHaveBeenCalled();
});