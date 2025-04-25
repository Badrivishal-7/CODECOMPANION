import React, { useState } from 'react';

const platforms = ["LeetCode", "Codeforces", "HackerRank", "CodeChef"];

function PlatformSelector({ onSubmit }) {
  const [selectedPlatform, setSelectedPlatform] = useState("");
  const [questionId, setQuestionId] = useState("");

  const handleSubmit = () => {
    if (selectedPlatform && questionId) {
      onSubmit({ platform: selectedPlatform, questionId });
    }
  };

  return (
    <div className="p-4 space-y-4 bg-white rounded shadow w-full max-w-md mx-auto mt-10">
      <h2 className="text-xl font-bold">Choose Platform and Question</h2>
      <select value={selectedPlatform} onChange={e => setSelectedPlatform(e.target.value)} className="w-full p-2 border rounded">
        <option value="">Select Platform</option>
        {platforms.map(p => <option key={p}>{p}</option>)}
      </select>
      <input
        type="text"
        value={questionId}
        placeholder="Enter Question ID or Title"
        onChange={e => setQuestionId(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <button onClick={handleSubmit} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Find Companion</button>
    </div>
  );
}

export default PlatformSelector;
