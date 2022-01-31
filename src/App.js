import logo from './logo.svg';
import './App.css';
import Poll from './components/pollOption';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
 } from "react-router-dom";
import AdminPanel from './components/adminPanel';

function App() {


  return (
    <BrowserRouter>
      <Routes>
        {/* <Route path="admin" element={ <AdminPanel/> } /> */}
        <Route path="/:id" element={<Poll />} />
        <Route path="/" element={<AdminPanel/> } />
        {/* <Route path="*" element={<Navigate to="/" />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
