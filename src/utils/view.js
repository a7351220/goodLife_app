import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import GlobalStyles from 'styles/GlobalStyles';
import { css } from "styled-components/macro"; //eslint-disable-line
import SaaSProductLandingPage from "demos/SaaSProductLandingPage.js";
import ComponentRenderer from "ComponentRenderer.js";
import Signup from "pages/Signup";
import Login from "pages/Login";
import Calculate from 'pages/Calculate';
import Quiz from 'pages/Quiz';
import Table from 'pages/Table';
import Stock from 'pages/Stock';
const View = ()=>{
    return (
        <Router>
            <GlobalStyles />
            <Routes>
                <Route path="/components/:type/:subtype/:name" element={<ComponentRenderer />} />
                <Route path="/components/:type/:name" element={<ComponentRenderer />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/" element={<SaaSProductLandingPage/>} />
                <Route path="/calculate" element={<Calculate />} />
                <Route path="/quiz" element={<Quiz />} />
                <Route path="/table" element={<Table/>} />
                <Route path="/stock" element={<Stock/>} />
            </Routes>
        </Router>
        )
};

export default View;