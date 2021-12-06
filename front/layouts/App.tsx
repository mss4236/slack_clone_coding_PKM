import React, { FC } from 'react';
import { Routes, Route, Navigate} from 'react-router-dom';
import loadable from '@loadable/component';

// 코드스플리팅
const LogIn = loadable(() => import('@pages/LogIn'));
const SignUp = loadable(() => import('@pages/SignUp'));

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