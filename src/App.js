
import './App.css';
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import AdminPanel from './components/adminPanel';
import Poll from './components/pollOption';
import { useState } from 'react/cjs/react.development';

function App() {

  const [loggedIn, setLogin] = useState(false);
  const [loginErr, setLoginErr] = useState(false);


  return (
    <BrowserRouter>
      <Routes>
        {/* <Route path="admin" element={ <AdminPanel/> } /> */}
        {/* <Route path="/add" element={<AddSurvey />} /> */}
        {/* <Route path="/results/:id" element={<Results />} /> */}
        <Route path="/poll/:id" element={<Poll />} />
        <Route path="/" element={<AdminPanel login={[loggedIn, setLogin]} error={[loginErr, setLoginErr]}/> } />
        {/* <Route path="*" element={<Navigate to="/" />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;