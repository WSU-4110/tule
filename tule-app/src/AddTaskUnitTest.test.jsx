
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

test("Test if taskName field is in the document", () =>{
    render(<AddTaskModal task={newTask} task_id={newTaskID} currentTasks={currentTasks} />);
    var nameField = screen.getByTestId("taskName");
    expect(nameField).toBeInTheDocument();
})


test("Test if taskDurationMinutes field is in the document", () =>{
    render(<AddTaskModal task={newTask} task_id={newTaskID} currentTasks={currentTasks} />);
    var durationField = screen.getByTestId("taskDurationMinutes");
    expect(durationField).toBeInTheDocument();
})


test("Test if taskBreakDurationMinutes is in the document", () =>{
    render(<AddTaskModal task={newTask} task_id={newTaskID} currentTasks={currentTasks} />);
    var breakField = screen.getByTestId("taskBreakDurationMinutes");
    expect(breakField).toBeInTheDocument();
})

test("Test if taskDate field is in the document", () =>{
    render(<AddTaskModal task={newTask} task_id={newTaskID} currentTasks={currentTasks} />);
    var dateField = screen.getByTestId("taskDate");
    expect(dateField).toBeInTheDocument();
})

test("test if taskPriority field is in the document", () =>{
    render(<AddTaskModal task={newTask} task_id={newTaskID} currentTasks={currentTasks} />);
    var priorityField = screen.getByTestId("taskPriority");
    expect(priorityField).toBeInTheDocument();
})

test('Test if the location dropdown is in the modal', () => {
    render(<AddTaskModal task={newTask} task_id={newTaskID} currentTasks={currentTasks} />);
    var locationField = screen.getByTestId("taskLocation");
    expect(locationField).toBeInTheDocument();
})

