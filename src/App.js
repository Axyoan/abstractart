import './App.css';
import { Routes, Route } from "react-router-dom"
import { Home } from './pages/Home';
import { SignUp } from './pages/SignUp';


function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </div>
  );
}

export default App;
