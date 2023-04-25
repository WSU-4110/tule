import {render, screen} from '@testing-library/jest-dom';
import '@testing-library/react';
import Task from './components/TaskComponent';
import Init from './Init';
{/*
1. Completion checkmark
2. Edit button on task page
3. Progress bar
4. Task Name Rendering
5. Init page login button
6. Init page signup button
*/}

test('Task checkmark rendering' , () => {
    var test = screen.getByTestId('checkmark');
    render(<Task Complete={true}/>);
    expect(test).toBeInTheDocument();
})

test('Edit button on the task page' , () => {
    var test = screen.getByTestId('edit-btn');
    render(<Task Complete={true}/>);
    expect(test).toBeInTheDocument();
})

test('Progress tracker' , () => {
    var test = screen.getByTestId('progress');
    render(<Task Complete={true}/>);
    expect(test).toBeInTheDocument();
})

test('Task Name Rendering' , () => {
    var test = screen.getByTestId('name');
    render(<Task Complete={true}/>);
    expect(test).toBeInTheDocument();
})

test('Inital Pages login button' , () => {
    var test = screen.getByTestId('login-btn');
    render(<Init/>);
    expect(test).toBeInTheDocument();
})

test('Initial Pages Signup button' , () => {
    var test = screen.getByTestId('signup-btn');
    render(<Init/>);
    expect(test).toBeInTheDocument();
})