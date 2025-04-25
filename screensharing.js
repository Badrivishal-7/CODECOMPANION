import React, { useRef, useState } from "react";

export default function ScreenSharing({ roomId }) {
  const [isSharing, setIsSharing] = useState(false);
  const localStream = useRef(null);

  const startScreenSharing = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
      });
      localStream.current.srcObject = stream;
      setIsSharing(true);
    } catch (err) {
      console.error("Error starting screen share: ", err);
    }
  };

  return (
    <div>
      <h3>Screen Sharing</h3>
      {isSharing ? (
        <div>
          <video ref={localStream} autoPlay />
        </div>
      ) : (
        <button onClick={startScreenSharing}>Start Screen Sharing</button>
      )}
    </div>
  );
}
