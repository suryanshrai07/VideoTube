import { useState, useEffect } from "react";
import Home from "./components/Home";
import { Routes, Route, Navigate } from "react-router-dom";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import VideoGrid from "./components/VideoGrid";
import { dummyVideos } from "./data/DummyVideoData";
import { useSelector,useDispatch } from "react-redux";
import { Loader } from "lucide-react";
import { checkAuthUser } from "./features/auth/authActions";
import UserProfile from "./components/UserProfile";
import {Toaster} from "react-hot-toast";

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
        <Route path="/" element={<Home />}>
          <Route
            index
            element={<VideoGrid videos={dummyVideos} loading={false} />}
          />
        </Route>

        <Route
          path="/sign-up"
          element={!isAuthenticated ? <SignUp /> : <Navigate to="/" />}
        />

        <Route
          path="/sign-in"
          element={!isAuthenticated ? <SignIn /> : <Navigate to="/" />}
        />

        <Route path="/user/:username" element={<Home/>}>
          <Route
            index
            element={<UserProfile videos={dummyVideos} loading={true} />}
          />
        </Route>
      </Routes>

      <Toaster/>
    </div>
  );
}

export default App;
