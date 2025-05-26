import { useState } from "react";
import { signup } from "@/lib/api";

// Define types for our options
type Specialization = string;
type Goal = Record<string, Specialization[]>;
type Streams = Record<string, Goal>;

const options: Streams = {
  Science: {
    Engineering: ["CS", "EE"],
    "Pure Sciences": ["General"],
  },
  Commerce: {
    "Bachelor of Commerce": ["General"],
    "Business Administration": ["General"],
  },
  Arts: {
    Law: ["General"],
    History: ["General"],
  },
};

export default function StreamSelector({ onUserCreated }: { onUserCreated: (userId: string) => void }) {
  const [stream, setStream] = useState<string>("");
  const [goal, setGoal] = useState<string>("");
  const [specialization, setSpecialization] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!stream || !goal || !specialization) {
      setError("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const data = await signup(stream, goal, specialization);
      if (data?.user_id) {
        onUserCreated(data.user_id);
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (err) {
      setError("Failed to create user. Please try again.");
      console.error("Signup error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4 p-4">
      <div>
        <label className="block mb-2 text-sm font-medium text-gray-700">Choose Stream:</label>
        <select 
          value={stream} 
          onChange={(e) => { 
            setStream(e.target.value); 
            setGoal(""); 
            setSpecialization(""); 
          }}
          className="w-full p-2 border rounded-md"
        >
          <option value="">-- Select a stream --</option>
          {Object.keys(options).map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {stream && (
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">Choose Goal:</label>
          <select 
            value={goal} 
            onChange={(e) => { 
              setGoal(e.target.value); 
              setSpecialization(""); 
            }}
            className="w-full p-2 border rounded-md"
          >
            <option value="">-- Select a goal --</option>
            {Object.keys(options[stream]).map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </div>
      )}

      {goal && (
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">Choose Specialization:</label>
          <select 
            value={specialization} 
            onChange={(e) => setSpecialization(e.target.value)}
            className="w-full p-2 border rounded-md"
          >
            <option value="">-- Select a specialization --</option>
            {options[stream][goal].map((sp) => (
              <option key={sp} value={sp}>{sp}</option>
            ))}
          </select>
        </div>
      )}

      {specialization && (
        <div className="pt-4">
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className={`w-full py-2 px-4 rounded-md text-white font-medium ${
              isLoading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isLoading ? 'Creating...' : 'Start Foundation Pathway'}
          </button>
        </div>
      )}

      {error && (
        <div className="mt-4 p-3 text-sm text-red-700 bg-red-100 rounded-md">
          {error}
        </div>
      )}
    </div>
  );
}