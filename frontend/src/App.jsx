import { useState, useEffect } from "react";
import Home from "./components/Home";
import { Routes, Route, Navigate } from "react-router-dom";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import { useSelector } from "react-redux";
import { Loader } from "lucide-react";
import { checkAuthUser } from "./features/auth/authActions";
import { useDispatch } from "react-redux";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuthUser());
  }, [dispatch]);

  const { loading, isAuthenticated } = useSelector((state) => state.auth);

  if (loading && !isAuthenticated) {
    return (
      <div className="w-screen h-screen flex justify-center items-center">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/sign-up"
          element={!isAuthenticated ? <SignUp /> : <Navigate to="/" />}
        />
        <Route
          path="/sign-in"
          element={!isAuthenticated ? <SignIn /> : <Navigate to="/" />}
        />
      </Routes>
    </div>
  );
}

export default App;
