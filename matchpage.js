import React, { useRef, useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:5000'); // Adjust if backend runs elsewhere

const RoomPage = () => {
  const myVideoRef = useRef();
  const userVideoRef = useRef();
  const user2WorkspaceRef = useRef();
  const [notes, setNotes] = useState('');
  const [user2Notes, setUser2Notes] = useState('');
  const [callEnded, setCallEnded] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [stream, setStream] = useState(null);
  const [videoOn, setVideoOn] = useState(true);
  const [screenSharing, setScreenSharing] = useState(false);
  const [screenStream, setScreenStream] = useState(null);
  const [videoTrack, setVideoTrack] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [recordedChunks, setRecordedChunks] = useState([]);

  useEffect(() => {
    const setupMedia = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        if (myVideoRef.current) {
          myVideoRef.current.srcObject = mediaStream;
        }
        setStream(mediaStream);

        const track = mediaStream.getVideoTracks()[0];
        setVideoTrack(track);

        // Initialize MediaRecorder
        const recorder = new MediaRecorder(mediaStream);
        setMediaRecorder(recorder);
        setRecordedChunks([]);

        recorder.ondataavailable = (e) => {
          if (e.data.size > 0) {
            setRecordedChunks((prev) => [...prev, e.data]);
          }
        };
        recorder.start();

        socket.emit('join-room', 'room-id');

        socket.on('user-joined', () => {
          console.log("User joined, implement video peer logic here.");
        });

        socket.on('receive-chat', (msg) => {
          setChatMessages(prev => [...prev, msg]);
        });

        const handleKeyDown = (e) => {
          if (e.key === "Escape") {
            if (mediaRecorder && mediaRecorder.state !== 'inactive') {
              mediaRecorder.stop();
            }
            stopMediaTracks();
          }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => {
          window.removeEventListener('keydown', handleKeyDown);
        };
      } catch (err) {
        console.error("Media error:", err);
      }
    };

    setupMedia();

    return () => {
      socket.disconnect();
    };
  }, []);

  const stopMediaTracks = () => {
    if (screenStream) {
      screenStream.getTracks().forEach((track) => track.stop());
    }
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
  };

  const endCall = () => {
    setCallEnded(true);
    socket.emit('end-call');
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
    }
    stopMediaTracks();
  };

  const toggleChat = () => {
    setChatOpen(prev => !prev);
  };

  const sendChat = () => {
    if (chatInput.trim() !== '') {
      socket.emit('send-chat', chatInput);
      setChatMessages(prev => [...prev, `Me: ${chatInput}`]);
      setChatInput('');
    }
  };

  const toggleVideo = () => {
    if (videoTrack) {
      if (videoOn) {
        videoTrack.stop();
        setVideoOn(false);
        if (myVideoRef.current) {
          myVideoRef.current.srcObject = null;
        }
      } else {
        navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((newStream) => {
          const newVideoTrack = newStream.getVideoTracks()[0];
          setVideoTrack(newVideoTrack);
          setStream(newStream);
          setVideoOn(true);
          if (myVideoRef.current) {
            myVideoRef.current.srcObject = newStream;
          }
        });
      }
    }
  };

  const startScreenShare = async () => {
    if (screenSharing) {
      if (screenStream) {
        screenStream.getTracks().forEach(track => track.stop());
      }
      setScreenSharing(false);
      if (stream) {
        myVideoRef.current.srcObject = stream;
      }
    } else {
      try {
        const screen = await navigator.mediaDevices.getDisplayMedia({ video: true });
        setScreenStream(screen);
        setScreenSharing(true);
        if (user2WorkspaceRef.current) {
          user2WorkspaceRef.current.srcObject = screen;
        }
        myVideoRef.current.srcObject = stream;
      } catch (error) {
        console.error("Failed to start screen sharing:", error);
      }
    }
  };

  if (callEnded) return <div className="text-center mt-20 text-xl">Call Ended</div>;

  return (
    <div className="w-full h-screen bg-gray-900 text-white flex flex-col">
      <div className="flex flex-grow">
        <div className="w-1/3 flex flex-col">
          <div className="flex-grow bg-gray-700 p-4">
            <h2 className="text-xl font-bold mb-2">User 2's Workspace</h2>
            {screenSharing ? (
              <video ref={user2WorkspaceRef} autoPlay playsInline className="w-full h-full bg-gray-700 rounded mb-4" />
            ) : (
              <textarea
                className="flex-grow w-full p-2 bg-gray-700 text-white rounded resize-none"
                placeholder="User 2's coding or notes here..."
                value={user2Notes}
                readOnly
              ></textarea>
            )}
          </div>
          <div className="h-1/3 bg-black flex items-center justify-center">
            <video ref={userVideoRef} autoPlay playsInline className="rounded shadow-lg w-full h-full object-cover" />
          </div>
        </div>

        <div className="w-2/3 flex flex-col p-4 bg-gray-800">
          <h2 className="text-xl font-bold mb-2">User 1's Shared Workspace</h2>
          {screenSharing ? (
            <video ref={user2WorkspaceRef} autoPlay playsInline className="w-full h-full bg-gray-700 rounded mb-4" />
          ) : (
            <textarea
              className="flex-grow w-full p-2 bg-gray-700 text-white rounded resize-none"
              placeholder="Start coding or writing notes here..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            ></textarea>
          )}
        </div>
      </div>

      <div className="absolute bottom-4 right-4 bg-black rounded-md shadow-md">
        <video ref={myVideoRef} autoPlay muted playsInline className="w-48 h-36 rounded-md" />
      </div>

      {chatOpen && (
        <div className="absolute bottom-4 left-4 w-64 bg-gray-800 p-3 rounded shadow-lg">
          <div className="h-32 overflow-y-auto bg-gray-700 p-2 rounded text-sm">
            {chatMessages.map((msg, index) => (
              <div key={index}>{msg}</div>
            ))}
          </div>
          <div className="mt-2 flex gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              className="flex-grow p-1 rounded bg-gray-600 text-white"
              placeholder="Type a message..."
            />
            <button onClick={sendChat} className="bg-green-600 px-2 py-1 rounded hover:bg-green-700 text-sm">Send</button>
          </div>
        </div>
      )}

      <div className="flex justify-center gap-4 p-4 bg-gray-800">
        <button onClick={toggleChat} className="bg-green-600 px-4 py-2 rounded hover:bg-green-700">Chat</button>
        <button onClick={startScreenShare} className={`px-4 py-2 rounded hover:bg-blue-700 ${screenSharing ? 'bg-red-600' : 'bg-blue-600'}`}>
          {screenSharing ? "Stop Screen Share" : "Start Screen Share"}
        </button>
        <button onClick={toggleVideo} className="bg-yellow-600 px-4 py-2 rounded hover:bg-yellow-700">
          {videoOn ? 'Stop Video' : 'Start Video'}
        </button>
        <button onClick={endCall} className="bg-red-600 px-4 py-2 rounded hover:bg-red-700">End Call</button>
      </div>

      {recordedChunks.length > 0 && (
        <a
          href={URL.createObjectURL(new Blob(recordedChunks, { type: 'video/webm' }))}
          download="recording.webm"
          className="absolute bottom-20 right-4 text-blue-400 underline"
        >
          Download Recording
        </a>
      )}
    </div>
  );
};

export default RoomPage;
