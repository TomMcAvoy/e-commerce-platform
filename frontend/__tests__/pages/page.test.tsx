import { render, screen } from '@testing-library/react';
import Page from '../../pages/Page';

describe('Page Component', () => {
    test('renders page title', () => {
        render(<Page />);
        const titleElement = screen.getByText(/page title/i);
        expect(titleElement).toBeInTheDocument();
    });

    test('renders page content', () => {
        render(<Page />);
        const contentElement = screen.getByText(/page content/i);
        expect(contentElement).toBeInTheDocument();
    });
});