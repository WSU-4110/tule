import {render, screen} from '@testing-library/react';
import '@testing-library/jest-dom';
import Task from './components/TaskComponent';
import Init from './Init';
import ProgressTracker from './components/ProgressTracker.jsx';

test('Task checkmark rendering' , () => {
    render(<Task task={[{Name: "", Complete:true}]}/>);
    var test = screen.getByTestId('checkmark');
    expect(test).toBeInTheDocument();
})

test('Edit button on the task page' , () => {
    render(<Task task={[{Name: "", Complete:true}]}/>);
    var test = screen.getByTestId('edit-btn');
    expect(test).toBeInTheDocument();
})

test('Progress tracker as a whole' , () => {
    render(<ProgressTracker ActiveTasks={[]}/>);
    var test = screen.getByTestId('progress');
    expect(test).toBeInTheDocument();
})

test('Task Name Rendering in task list page' , () => {
    render(<Task task={[{Name: "", Complete:true}]}/>);
    var test = screen.getByTestId('name');
    expect(test).toBeInTheDocument();
})

test('login button on inital Page' , () => {
    render(<Init/>);
    var test = screen.getByTestId('login-btn');
    expect(test).toBeInTheDocument();
})

test('Signup button on initial Pages' , () => {
    render(<Init/>);
    var test = screen.getByTestId('signup-btn');
    expect(test).toBeInTheDocument();
})