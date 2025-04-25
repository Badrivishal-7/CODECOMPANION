import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const platforms = ['LeetCode', 'Codeforces', 'HackerRank', 'CodeChef'];
const questions = {
  LeetCode: ['Two Sum', 'Longest Substring', 'Median of Two Sorted Arrays'],
  Codeforces: ['Problem A', 'Problem B', 'Problem C'],
  HackerRank: ['Simple Array Sum', 'Compare the Triplets'],
  CodeChef: ['Chef and Easy Problem', 'Rain in Chefland']
};

export default function Home() {
  const [platform, setPlatform] = useState('LeetCode');
  const [question, setQuestion] = useState('Two Sum');
  const [roomCode, setRoomCode] = useState('');
  const navigate = useNavigate();

  const handleMatch = () => {
    // simulate a backend request for match
    console.log(`Matching on ${platform} -> ${question}`);
    navigate('/match', { state: { platform, question } });
  };

  const handleRoomJoin = () => {
    if (roomCode.trim() !== '') {
      console.log(`Joining room: ${roomCode}`);
      navigate(`/room/${roomCode}`);
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-3xl font-bold mb-4">Coding Companion</h1>

      {/* Platform Selection */}
      <label className="block mb-2 font-semibold">Select Platform:</label>
      <select
        className="mb-4 p-2 border rounded w-full"
        value={platform}
        onChange={(e) => {
          setPlatform(e.target.value);
          setQuestion(questions[e.target.value][0]);
        }}
      >
        {platforms.map((p) => (
          <option key={p} value={p}>{p}</option>
        ))}
      </select>

      {/* Question Selection */}
      <label className="block mb-2 font-semibold">Select Question:</label>
      <select
        className="mb-4 p-2 border rounded w-full"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      >
        {questions[platform].map((q) => (
          <option key={q} value={q}>{q}</option>
        ))}
      </select>

      {/* Matchmaking Button */}
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
        onClick={handleMatch}
      >
        Find a Match
      </button>

      {/* Divider */}
      <div className="my-6 text-center text-gray-500">— or —</div>

      {/* Room Join */}
      <input
        className="p-2 border rounded w-full mb-2"
        type="text"
        placeholder="Enter Room Code"
        value={roomCode}
        onChange={(e) => setRoomCode(e.target.value)}
      />
      <button
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 w-full"
        onClick={handleRoomJoin}
      >
        Join Room with Code
      </button>
    </div>
    
  );
}
