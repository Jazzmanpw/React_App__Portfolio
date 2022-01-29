import React from 'react';
import './Frame.css';
import { Link, Outlet } from 'react-router-dom';

function Frame() {
  return (
    <>
      <div className="header">
        <div className="container">
          <ul className="menu">
            <li>
              <Link to=".">Главная</Link>
            </li>
            <li>
              <Link to="/anastasia">Анастасия</Link>
            </li>
            <li>
              <Link to="/viktor">Виктор</Link>
            </li>
            <li>
              <Link to="/timer">Таймер</Link>
            </li>
          </ul>
        </div>
      </div>
      <Outlet />
    </>
  );
}
export default Frame;
