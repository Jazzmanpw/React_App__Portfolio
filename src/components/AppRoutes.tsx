import React from 'react';
import { Route, Routes } from 'react-router-dom';
import MultiTimer from './MultiTimer';
import Frame from './Frame';
import DevPage from './DevPage';
import Home from './Home.jsx';
import './Frame.css';

function AppRoutes() {
  return (
    <Routes>
      <Route element={<Frame />}>
        <Route index element={<Home />} />
        <Route
          path="/anastasia"
          element={<DevPage name="Страница Анастасии" projects={[]} />}
        />
        <Route
          path="/viktor"
          element={<DevPage name="Страница Виктора" projects={[]} />}
        />
        <Route path="/timer" element={<MultiTimer />} />
      </Route>
    </Routes>
  );
}
export default AppRoutes;
