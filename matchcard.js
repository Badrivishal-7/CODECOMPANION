import React from "react";
import "./../styles/MatchCard.css";

const MatchCard = ({ user, onAccept, onReject }) => {
  return (
    <div className="match-card">
      <h2>You’ve been matched!</h2>
      <p><strong>Name:</strong> {user.name}</p>
      <p><strong>Username:</strong> {user.username}</p>
      <p><strong>Platform:</strong> {user.platform}</p>
      <p><strong>Online:</strong> {user.isOnline ? "Yes ✅" : "No ❌"}</p>
      <div className="match-card-actions">
        <button className="accept-btn" onClick={onAccept}>Accept</button>
        <button className="reject-btn" onClick={onReject}>Reject</button>
      </div>
    </div>
  );
};

export default MatchCard;

