import {render, fireEvent, screen} from "@testing-library/react";
import renderer from "react-test-renderer";
import Schedule from "./Schedule";
import "@testing-library/jest-dom"

test("testing if the back button appears", () =>{
    render(<Schedule/>);
    var backButton = screen.getByTestId("backBtn");
    expect(backButton).toBeInTheDocument();
})

test("testing if the logout button appears", () =>{
    render(<Schedule/>);
    var logButton = screen.getByTestId("logBtn");
    expect(logButton).toBeInTheDocument();
})

test("testing if the change active hours button appears", () =>{
    render(<Schedule/>);
    var activeButton = screen.getByTestId("activeBtn");
    expect(activeButton).toBeInTheDocument();
})

test("testing if the day display appears", () =>{
    render(<Schedule/>);
    var currentDay = screen.getByTestId("dayDisplay");
    expect(currentDay).toBeInTheDocument();
})

test("testing if the active hours are displayed on the side of the grid", () =>{
    render(<Schedule/>);
    var gridTime = screen.getByTestId("timeScale");
    expect(gridTime).toBeInTheDocument();
})

test("testing if the task entries is displayed on the other side of the grid", () =>{
    render(<Schedule/>);
    var gridTask = screen.getByTestId("taskEntries");
    expect(gridTask).toBeInTheDocument();
})