import React, { FC } from 'react';
import { Routes, Route, Navigate} from 'react-router-dom';
import LogIn from '@pages/LogIn';
import SignUp from '@pages/SignUp';

const App : FC = () => {
    return (
    <Routes>
        <Route path="/" element={<Navigate to="/login"/>}></Route>
        <Route path="/login/*" element={<LogIn/>}></Route>
        <Route path="/signup/*" element={<SignUp/>}></Route>
    </Routes>
    );
};

export default App;