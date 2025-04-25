import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

export default function VoiceCall({ roomId, userName }) {
  const [isCalling, setIsCalling] = useState(false);
  const [peerConnection, setPeerConnection] = useState(null);
  const localStream = useRef(null);
  const remoteStream = useRef(null);

  useEffect(() => {
    socket.emit("join-room", roomId);

    socket.on("signal", (data) => {
      handleSignalData(data);
    });

    return () => {
      socket.off("signal");
    };
  }, [roomId]);

  const startCall = () => {
    // Create peer connection and start the call
  };

  const handleSignalData = (data) => {
    // Handle incoming signaling data to establish the call
  };

  return (
    <div>
      <h3>Voice Call</h3>
      {isCalling ? (
        <div>
          <video ref={remoteStream} autoPlay />
          <video ref={localStream} muted autoPlay />
        </div>
      ) : (
        <button onClick={startCall}>Start Call</button>
      )}
    </div>
  );
}
