// src/components/Home.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();

    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h1>Bem-vindo ao Sistema Esportivo</h1>
            <button onClick={() => navigate('/login')} style={{ marginTop: '20px' }}>
                Acessar Login
            </button>
        </div>
    );
};

export default Home;
