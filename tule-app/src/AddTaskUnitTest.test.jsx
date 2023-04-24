
import {render, fireEvent, screen} from "@testing-library/react";
import renderer from "react-test-renderer";
import { AddTaskModal } from "./AddTaskModal";
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
    render(<AddTaskModal task={newTask} task_id={newTaskID} currentTasks={currentTasks} />);
    var nameField = screen.getByTestId("taskName");
    expect(nameField).toBeInTheDocument();
})


test("Testing if '0' is in the minute's field for the task's duration.", () =>{
    render(<AddTaskModal task={newTask} task_id={newTaskID} currentTasks={currentTasks} />);
    var durationField = screen.getByTestId("taskDurationMinutes");
    expect(durationField).toBeInTheDocument();
})


test("Testing if '0' is in the minute's field for the task's break.", () =>{
    render(<AddTaskModal task={newTask} task_id={newTaskID} currentTasks={currentTasks} />);
    var breakField = screen.getByTestId("taskBreakDurationMinutes");
    expect(breakField).toBeInTheDocument();
})

test("Testing if '2023-04-23' is the task's date.", () =>{
    render(<AddTaskModal task={newTask} task_id={newTaskID} currentTasks={currentTasks} />);
    var dateField = screen.getByTestId("taskDate");
    expect(dateField).toBeInTheDocument();
})

test("Testing if '3' is the task's priority.", () =>{
    render(<AddTaskModal task={newTask} task_id={newTaskID} currentTasks={currentTasks} />);
    var priorityField = screen.getByTestId("taskPriority");
    expect(priorityField).toBeInTheDocument();
})

