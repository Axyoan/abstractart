import './App.css';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import { SignUp } from './pages/SignUp';
import MainHome from './pages/MainHome';
import Galery from './pages/galery';
import NavBarExample from './layouts/navbar';
import StartDrawing from './pages/StartDrawing';


function App() {
  return (
    <div className="App">

      <Routes>
        <Route path='/' element={<NavBarExample />}>
          <Route index element={<MainHome />} />
          <Route path='galery' element={<Galery />} />
          <Route path='startdrawing' element={<StartDrawing />} />
          <Route path='signup' element={<SignUp />} />
          <Route path='*' element={<Navigate replace to="/" />} />
        </Route>
      </Routes>

    </div>
  );
}

export default App;
