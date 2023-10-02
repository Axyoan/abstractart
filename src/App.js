import './App.css';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import { SignUp } from './pages/SignUp';
import LogIn from './pages/LogIn'
import MainHome from './pages/MainHome';
import Gallery from './pages/Gallery';
import NavBarExample from './layouts/navbar';
import StartDrawing from './pages/StartDrawing';
import ContinueDrawing from './pages/ContinueDrawing'


function App() {
  return (
    <div className="App">

      <Routes>
        <Route path='/' element={<NavBarExample />}>
          <Route index element={<MainHome />} />
          <Route path='Home/:status' element={<MainHome />} />
          <Route path='gallery' element={<Gallery />} />
          <Route path='startdrawing' element={<StartDrawing />} />
          <Route path='signup' element={<SignUp />} />
          <Route path='login' element={<LogIn />} />
          <Route path="continueDrawing/:id" element={<ContinueDrawing />} />
          <Route path='*' element={<Navigate replace to="/" />} />
        </Route>
      </Routes>

    </div>
  );
}

export default App;
