import Login from "../src/pages/Login";
import Register from "../src/pages/Register"
import Dashboard from "../src/pages/Dashboard";
import Editor from "../src/pages/Editor";
import Auth from "../pages/Auth"

import { BrowserRoutes, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRoutes>
      <routes>
        <route path="/" element={<Login />} />
        <route
          path="/dashboard"
          element={
            <Auth>
              <Dashboard/>
            </Auth>
          }
        />
        <route path = "/register" element = {<Register/>}/>
        <route path = "/editor" element = {<Editor/>}/>
      </routes>
    </BrowserRoutes>
  );
}

export default App;
