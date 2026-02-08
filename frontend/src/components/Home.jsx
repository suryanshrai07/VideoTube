import React from "react";
import Navbar from "./Navbar";
import Sidebar from "./layout/Sidebar";
import VideoGrid from "./layout/VideoGrid";
import { dummyVideos } from "../data/DummyVideoData";

const Home = () => {
  return (
    <div className="h-screen flex flex-col bg-black">
      <div className="h-16 sm:h-18 shrink-0">
        <Navbar />
      </div>

      <div className="flex-1 flex  min-h-0">
        <Sidebar />
        <main className="flex-1 overflow-y-auto scroll-smooth">
          <VideoGrid videos={dummyVideos} loading={false} />
        </main>
      </div>
    </div>
  );
};  

export default Home;
