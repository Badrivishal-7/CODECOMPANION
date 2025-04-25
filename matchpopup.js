function MatchPopup({ matchData, onAccept, onReject }) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/40">
        <div className="bg-white p-6 rounded shadow-lg text-center">
          <h3 className="text-lg font-bold mb-2">Companion Found!</h3>
          <p>Platform: {matchData.platform}</p>
          <p>Question: {matchData.questionId}</p>
          <div className="mt-4 flex gap-4 justify-center">
            <button onClick={onAccept} className="bg-green-500 px-4 py-2 text-white rounded">Accept</button>
            <button onClick={onReject} className="bg-red-500 px-4 py-2 text-white rounded">Reject</button>
          </div>
        </div>
      </div>
    );
  }
  
