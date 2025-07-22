import React from 'react';
import { render, screen } from '@testing-library/react';
import Header from '../../components/Header';

describe('Header Component', () => {
    test('renders header with title', () => {
        render(<Header title="My App" />);
        const titleElement = screen.getByText(/My App/i);
        expect(titleElement).toBeInTheDocument();
    });

    test('renders navigation links', () => {
        render(<Header />);
        const linkElement = screen.getByRole('link', { name: /home/i });
        expect(linkElement).toBeInTheDocument();
    });

    test('renders logo', () => {
        render(<Header />);
        const logoElement = screen.getByAltText(/logo/i);
        expect(logoElement).toBeInTheDocument();
    });
});