import './App.css';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';


import { Home } from './pages/Home';
import { SignUp } from './pages/SignUp';
import MainHome from './pages/MainHome';
import Galery from './pages/galery';
import NavBarExample from './layouts/navbar';


function App() {
  return (
    <div className="App">

<Routes>
  <Route path='/' element={ <NavBarExample /> }>
    <Route index element={ <MainHome /> } />
    <Route path='galery' element={ <Galery /> } />
    <Route path='canvas' element={ <Home /> } />
    <Route path='signup' element={ <SignUp /> } />
    <Route path='*' element={ <Navigate replace to="/"/> }/>
  </Route>
</Routes> 

    </div>
  );
}

export default App;
