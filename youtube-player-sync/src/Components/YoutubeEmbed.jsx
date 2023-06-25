import React, { useEffect, useRef, useState } from "react";
import {
  PlayIcon,
  PauseIcon,
  BackwardIcon,
  ForwardIcon,
} from "@heroicons/react/24/outline";
import ReactPlayer from "react-player";
import { io } from "socket.io-client";

const socket = io.connect("http://192.168.0.103:3001");

const YoutubeEmbed = ({ embedId }) => {
  const playerRef = useRef(null);
  const [play, setPlay] = useState(false);
  const [seek, setSeek] = useState(0);
  const [duration, setDuration] = useState(0);
  const [url, setUrl] = useState("https://www.youtube.com/embed/rokGy0huYEA");

  const handleClick = async () => {
    const res = await setPlay(!play);
  };

  const handleRewind = async () => {
    await playerRef.current.seekTo(playerRef.current.getCurrentTime() - 10);
    socket.emit("set_duration", playerRef.current.getCurrentTime() - 10);
  };

  const handleFastForward = async () => {
    await playerRef.current.seekTo(playerRef.current.getCurrentTime() + 10);
    socket.emit("set_duration", playerRef.current.getCurrentTime() + 10);
  };

  const handleSeek = (e) => {
    e.preventDefault();
    playerRef.current.seekTo(e.target.value);
    socket.emit("set_duration", e.target.value);
  };

  useEffect(() => {
    socket.emit("send_message", play);
    socket.on("receive_message", (data) => {
      setPlay(data);
    });
    setDuration(playerRef.current.getDuration());
    socket.on("get_duration", (data) => {
      playerRef.current.seekTo(data);
    });
  }, [play, socket]);

  return (
    <>
      <div className="video-responsive">
        <div>
          <h1 className=" text-white mb-4 text-3xl ">Watch Party</h1>
          <input
            type="text"
            className="block mb-2 text-sm font-medium text-gray-900 rounded-md border-0 outline-0 px-4"
            onChange={(e) => setUrl(e.target.value)}
          />
        </div>
        <ReactPlayer
          ref={playerRef}
          width="980"
          height="600"
          url={url}
          controls={false}
          playing={play}
          onProgress={(e) => setSeek(e.playedSeconds)}
        />
        <div className="actions  ">
          <button onClick={handleRewind}>
            <BackwardIcon className="h-7 w-7 text-white" />
          </button>
          <button onClick={handleClick}>
            {play ? (
              <PauseIcon className="h-7 w-7 text-white" />
            ) : (
              <PlayIcon className="h-7 w-7 text-white" />
            )}
          </button>
          <button onClick={handleFastForward}>
            <ForwardIcon className="h-7 w-7 text-white" />
          </button>
          <input
            type="range"
            min={0}
            max={duration}
            value={seek}
            onInput={(e) => handleSeek(e)}
            className=" h-7"
          />
        </div>
      </div>
    </>
  );
};

export default YoutubeEmbed;
