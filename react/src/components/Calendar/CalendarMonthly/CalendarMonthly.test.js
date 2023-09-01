
const React = require('react');
const { render, fireEvent } = require('@testing-library/react');
const CalendarMonthly = require('./CalendarMonthly.jsx'); 

describe('CalendarMonthly Component', () => {
  it('renders without errors', () => {
    render(<CalendarMonthly />);
  });

  // Add more test cases here
});
