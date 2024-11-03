import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import Cadastro from './components/Cadastro';
import Federacoes from './components/Federacoes';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/cadastro" element={<Cadastro />} />
                <Route path="/federacoes" element={<Federacoes />} />
            </Routes>
        </Router>
    );
};

export default App;
