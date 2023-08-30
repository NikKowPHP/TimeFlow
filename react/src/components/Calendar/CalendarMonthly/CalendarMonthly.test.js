import React from "react";
import { render, fireEvent } from "@testing-library/react";
import CalendarMonthly from "./CalendarMonthly";

describe('CalendarMonthly Component', () => {
	it('renders without errors', () => {
		render(<CalendarMonthly />);
	})
});