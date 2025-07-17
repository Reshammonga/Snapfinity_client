import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./Components/ProtectedRoute";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import CreatePost from "./Pages/CreatePost";
import Profile from "./Pages/Profile";
import UserList from "./Pages/UserList";
import { useDispatch } from "react-redux";
import { fetchCurrentUser } from "./features/auth/authSlice";
import { useEffect } from "react";
import UserProfile from "./Pages/UserProfile";

function App() {
  const dispatch = useDispatch();
  useEffect(() => {
  dispatch(fetchCurrentUser());
  }, [dispatch])
  
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/register" element={<Register />} />
          <Route exact path="/createpost" element={<ProtectedRoute><CreatePost></CreatePost></ProtectedRoute>}></Route>
          <Route path="/profile" element={
  <ProtectedRoute>
    <Profile />
  </ProtectedRoute>
} />
<Route path="/users" element={
  <ProtectedRoute>
    <UserList />
  </ProtectedRoute>
} />
<Route path="/user/:id" element={
  <ProtectedRoute>
    <UserProfile />
  </ProtectedRoute>
} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
