import React from "react";
import { render } from "@testing-library/react";
import CalendarMonthly from "./CalendarMonthly";

jest.mock("../../customHooks/useCalendarState", () => ({
  __esModule: true,
  useCalendarState: jest.fn(),
}));

jest.mock("../../customHooks/useModalState", () => ({
  __esModule: true,
  useCalendarState: jest.fn(),
}));

jest.mock("../newTaskHandler", () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe("CalendarMonthly Component", () => {
  const mockDates = [new Date("2023-08-01"), new Date("2023-08-02")];
  const mockCurrentDate = new Date("2023-08-01");
  const mockAllTasks = [
    {
      id: 1,
      title: "Task 1",
      time_start: "07:00",
      time_end: "08:00",
      date: "2023-08-01",
    },
    {
      id: 2,
      title: "Task 2",
      time_start: "09:00",
      time_end: "10:00",
      date: "2023-08-01",
    },
  ];

  const mockUseCalendarState = jest.fn(() => ({
    dates: mockDates,
    currentDate: mockCurrentDate,
    allTasks: mockAllTasks,
    selectedDate: new Date("2023-08-01"),
    setSelectedDate: jest.fn(),
    getTasksByDate: jest.fn(),
  }));

  const mockUseModalState = jest.fn(() => ({
    openedModalId: null,
    isModalVisible: false,
    modalPositionClass: "",
    showModal: jest.fn(),
    hideModal: jest.fn(),
  }));

  const mockNewTaskHandler = jest.fn(() => ({
    task: {
      id: null,
      title: "",
      time_start: "",
      time_end: "",
      date: "",
    },
    setTask: jest.fn(),
    handleTaskCreation: jest.fn(),
  }));

  const mockGetTasksByDate = jest.fn();

  it("renders date tasks correctly", () => {
    mockGetTasksByDate.mockReturnValue([
      { id: 1, title: "Task 1", time_start: "08:00", time_end: "09:00" },
      { id: 2, title: "Task 2", time_start: "10:00", time_end: "11:00" },
    ]);
  });

  beforeEach(() => {
    mockUseCalendarState.mockClear();
    mockUseModalState.mockClear();
    mockNewTaskHandler.mockClear();

    require("../../customHooks/useCalendarState").useCalendarState =
      mockUseCalendarState;
    require("../../customHooks/useModalState").useModalState =
      mockUseModalState;
    require("../newTaskHandler").default = mockNewTaskHandler;
  });

  it("renders without errors", () => {
    mockUseCalendarState.mockReturnValue({
      getTasksByDate: mockGetTasksByDate,
      dates: mockDates,
    });

    const { getByText } = render(<CalendarMonthly />);

  });

});
