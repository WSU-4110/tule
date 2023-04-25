import {render, screen} from '@testing-library/react';
import '@testing-library/jest-dom';
import Task from './components/TaskComponent';
import Init from './Init';
import progressTracker from './components/progressTracker.jsx';
{/*
1. Completion checkmark
2. Edit button on task page
3. Progress bar
4. Task Name Rendering
5. Init page login button
6. Init page signup button
*/}

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

test('Progress tracker' , () => {
    render(<progressTracker ActiveTasks={[]}/>);
    var test = screen.getByTestId('progress');
    expect(test).toBeInTheDocument();
})

test('Task Name Rendering' , () => {
    render(<Task task={[{Name: "", Complete:true}]}/>);
    var test = screen.getByTestId('name');
    expect(test).toBeInTheDocument();
})

test('Inital Pages login button' , () => {
    render(<Init/>);
    var test = screen.getByTestId('login-btn');
    expect(test).toBeInTheDocument();
})

test('Initial Pages Signup button' , () => {
    render(<Init/>);
    var test = screen.getByTestId('signup-btn');
    expect(test).toBeInTheDocument();
})
