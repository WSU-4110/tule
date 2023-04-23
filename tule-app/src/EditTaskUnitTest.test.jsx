
import {render, fireEvent, screen} from "@testing-library/react";
import renderer from "react-test-renderer";
import { EditTaskModal } from "./EditTaskModal";
import "@testing-library/jest-dom"

const newTaskID = "1234567890";
const newTask = {
    _id: "",
    Name: "Task Name",
    StartTime: {
        Active: true,
        Time: "6:00"}
        ,
    Duration: "1.0",
    Break: {
        Active: true,
        Time: "1.0"
    },
    Date: {
        Active: true, 
        Time: "2023-04-23"}
        ,
    Reccurence: [{ name: 'Sunday', id: 0 }],
    Priority: "3",
    Location: "Wayne State University",
    Complete: false
}
const currentTasks = [newTask];

test("Testing if 'Task Name' is the task's name.", () =>{
    render(<EditTaskModal task={newTask} task_id={newTaskID} currentTasks={currentTasks} />);
    var nameField = screen.getByTestId("taskName");
    expect(nameField).toHaveValue("Task Name");
})

test("Testing if '1' is in the hour's field for the task's duration.", () =>{
    render(<EditTaskModal task={newTask} task_id={newTaskID} currentTasks={currentTasks} />);
    var durationField = screen.getByTestId("taskDurationHours");
    expect(durationField).toHaveValue(1);
})

test("Testing if '0' is in the minute's field for the task's duration.", () =>{
    render(<EditTaskModal task={newTask} task_id={newTaskID} currentTasks={currentTasks} />);
    var durationField = screen.getByTestId("taskDurationMinutes");
    expect(durationField).toHaveValue(0);
})

test("Testing if '1' is in the hour's field for the task's break.", () =>{
    render(<EditTaskModal task={newTask} task_id={newTaskID} currentTasks={currentTasks} />);
    var breakField = screen.getByTestId("taskBreakDurationHours");
    expect(breakField).toHaveValue(1);
})

test("Testing if '0' is in the minute's field for the task's break.", () =>{
    render(<EditTaskModal task={newTask} task_id={newTaskID} currentTasks={currentTasks} />);
    var breakField = screen.getByTestId("taskBreakDurationMinutes");
    expect(breakField).toHaveValue(0);
})

test("Testing if '2023-04-23' is the task's date.", () =>{
    render(<EditTaskModal task={newTask} task_id={newTaskID} currentTasks={currentTasks} />);
    var dateField = screen.getByTestId("taskDate");
    expect(dateField).toHaveValue("2023-04-23");
})

test("Testing if '3' is the task's priority.", () =>{
    render(<EditTaskModal task={newTask} task_id={newTaskID} currentTasks={currentTasks} />);
    var priorityField = screen.getByTestId("taskPriority");
    expect(priorityField).toHaveTextContent("3");
})

