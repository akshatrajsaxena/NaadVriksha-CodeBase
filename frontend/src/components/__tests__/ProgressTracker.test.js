import React from 'react';
import { render, screen } from '@testing-library/react';
import ProgressTracker from '../ProgressTracker';

describe('ProgressTracker Component', () => {
  test('renders with basic props', () => {
    render(<ProgressTracker current={5} total={10} taskName="Math Task" />);
    
    expect(screen.getByText('Math Task')).toBeInTheDocument();
    expect(screen.getByText('5 / 10')).toBeInTheDocument();
    expect(screen.getByText('50%')).toBeInTheDocument();
  });

  test('calculates percentage correctly', () => {
    render(<ProgressTracker current={3} total={4} />);
    
    expect(screen.getByText('75%')).toBeInTheDocument();
  });

  test('handles edge case where current exceeds total', () => {
    render(<ProgressTracker current={15} total={10} />);
    
    expect(screen.getByText('10 / 10')).toBeInTheDocument();
    expect(screen.getByText('100%')).toBeInTheDocument();
  });

  test('handles edge case where current is negative', () => {
    render(<ProgressTracker current={-5} total={10} />);
    
    expect(screen.getByText('0 / 10')).toBeInTheDocument();
    expect(screen.getByText('0%')).toBeInTheDocument();
  });

  test('handles zero total gracefully', () => {
    render(<ProgressTracker current={0} total={0} />);
    
    expect(screen.getByText('0 / 1')).toBeInTheDocument();
    expect(screen.getByText('0%')).toBeInTheDocument();
  });

  test('shows completion message when 100% complete', () => {
    render(<ProgressTracker current={10} total={10} taskName="Test Task" />);
    
    expect(screen.getByText('Test Task Complete!')).toBeInTheDocument();
  });

  test('hides percentage when showPercentage is false', () => {
    render(<ProgressTracker current={5} total={10} showPercentage={false} />);
    
    expect(screen.queryByText('50%')).not.toBeInTheDocument();
    expect(screen.getByText('5 / 10')).toBeInTheDocument();
  });

  test('hides steps when showSteps is false', () => {
    render(<ProgressTracker current={5} total={10} showSteps={false} />);
    
    expect(screen.queryByText('5 / 10')).not.toBeInTheDocument();
  });

  test('shows step indicators for small totals', () => {
    render(<ProgressTracker current={2} total={5} />);
    
    // Should show step indicators (circles) for totals <= 20
    const stepIndicators = screen.getByRole('generic').querySelectorAll('[title^="Step"]');
    expect(stepIndicators.length).toBeGreaterThan(0);
  });

  test('shows current question indicator for large totals', () => {
    render(<ProgressTracker current={15} total={50} />);
    
    expect(screen.getByText('Question 16')).toBeInTheDocument();
  });

  test('applies different size classes', () => {
    const { rerender } = render(<ProgressTracker current={5} total={10} size="small" />);
    expect(screen.getByText('Task')).toHaveClass('text-sm');
    
    rerender(<ProgressTracker current={5} total={10} size="large" />);
    expect(screen.getByText('Task')).toHaveClass('text-lg');
  });

  test('applies different variant colors', () => {
    const { rerender } = render(<ProgressTracker current={5} total={10} variant="success" />);
    expect(screen.getByText('Task')).toHaveClass('text-green-700');
    
    rerender(<ProgressTracker current={5} total={10} variant="error" />);
    expect(screen.getByText('Task')).toHaveClass('text-red-700');
  });

  test('uses default task name when not provided', () => {
    render(<ProgressTracker current={5} total={10} />);
    
    expect(screen.getByText('Task')).toBeInTheDocument();
  });

  test('progress bar width reflects completion percentage', () => {
    render(<ProgressTracker current={3} total={10} />);
    
    // The progress bar should have width: 30%
    const progressBar = screen.getByRole('generic').querySelector('[style*="width: 30%"]');
    expect(progressBar).toBeInTheDocument();
  });
});