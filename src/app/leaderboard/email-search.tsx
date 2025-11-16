"use client";

import { useState } from "react";
import Image from "next/image";

type User = {
  id: string;
  name?: string;
  email?: string;
  current_streak?: number;
};

type Result =
  | {
      type: "success";
      rank: number;
      streak: number;
      emoji: string;
      title: string;
      name: string;
    }
  | {
      type: "error";
      message: string;
    }
  | null;

export default function EmailSearch({ users }: { users: User[] }) {
  const [email, setEmail] = useState("");
  const [result, setResult] = useState<Result>(null);
  const [showAll, setShowAll] = useState(false);

  const getFallbackName = (email?: string) => {
    if (!email) return "Mystery Warrior";
    return `${email.slice(0, 3)}_reader`;
  };

  const handleSearch = () => {
    if (!email.trim()) {
      setResult({ type: "error", message: "Please enter an email address." });
      return;
    }

    const index = users.findIndex(
      (u) => u.email?.toLowerCase() === email.toLowerCase()
    );

    if (index === -1) {
      setResult({ type: "error", message: "📧 Email not found in leaderboard." });
      return;
    }

    const rank = index + 1;
    const user = users[index];
    const streak = user.current_streak ?? 0;

    let emoji = "🎯";
    let title = "Keep Going!";

    if (rank === 1) {
      emoji = "👑";
      title = "You're #1!";
    } else if (rank === 2) {
      emoji = "🥈";
      title = "So Close!";
    } else if (rank === 3) {
      emoji = "🥉";
      title = "Top 3!";
    } else if (rank <= 10) {
      emoji = "⭐";
      title = "Top 10!";
    }

    setResult({
      type: "success",
      rank,
      streak,
      emoji,
      title,
      name: user.name || getFallbackName(user.email),
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 mt-10 w-full max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">
        🔍 Find Your Rank
      </h2>

      <div className="space-y-4">
        <input
          type="email"
          placeholder="Enter your email address..."
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all text-base"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setResult(null);
          }}
          onKeyPress={handleKeyPress}
        />

        <button
          onClick={handleSearch}
          className="w-full py-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-xl font-bold transition-all transform hover:scale-[1.02] shadow-lg text-base"
        >
          Check My Rank 🚀
        </button>
      </div>

      {result && (
        <div
          className={`mt-6 p-6 rounded-xl border-2 animate-fadeIn ${
            result.type === "success"
              ? "bg-gradient-to-br from-green-50 to-emerald-50 border-green-300"
              : "bg-gradient-to-br from-red-50 to-pink-50 border-red-300"
          }`}
        >
          {result.type === "success" ? (
            <div className="text-center space-y-3">
              <div className="text-6xl">{result.emoji}</div>

              <h3 className="text-2xl font-black text-gray-900">
                {result.title}
              </h3>

              <p className="text-lg text-gray-700">
                Hey{" "}
                <span className="font-bold text-orange-600">
                  {result.name}
                </span>
                !
              </p>

              {/* MOBILE RESPONSIVE RANK BOX */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-lg font-bold">
                <div className="relative flex justify-center">
                  <Image
                    src="/icon.png"
                    alt="OnePage App Icon"
                    width={60}
                    height={60}
                    className="rounded-3xl shadow-lg shadow-sky-500/20"
                  />
                </div>

                <div className="flex flex-row gap-2 sm:gap-4">
                  <span className="bg-white px-5 py-2 rounded-xl shadow-md border-2 border-orange-300 text-center">
                    Rank: <span className="text-orange-600">#{result.rank}</span>
                  </span>

                  <span className="bg-white px-5 py-2 rounded-xl shadow-md border-2 border-orange-300 text-center">
                    🔥 {result.streak}
                  </span>
                </div>
              </div>

              {result.rank > 3 && (
                <p className="text-sm text-gray-600 pt-2">
                  Keep pushing! You're doing great!
                </p>
              )}
            </div>
          ) : (
            <div className="text-center">
              <p className="text-lg font-semibold text-gray-700">
                {result.message}
              </p>
              <p className="text-sm text-gray-600 mt-2">
                Make sure you've signed up and are on the leaderboard!
              </p>
            </div>
          )}
        </div>
      )}

      <button
        onClick={() => setShowAll((s) => !s)}
        className="w-full mt-6 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-all border-2 border-gray-300 text-base"
      >
        {showAll ? "▲ Hide Full Rankings" : "▼ View All Rankings"}
      </button>

      {showAll && (
        <div className="mt-4 space-y-2 max-h-96 overflow-y-auto bg-gray-50 rounded-xl p-4 border-2 border-gray-200 w-full">
          {users.map((u, idx) => (
            <div
              key={u.id}
              className="p-3 bg-white rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 hover:bg-orange-50 transition-all shadow-sm border border-gray-200"
            >
              <div className="flex items-center gap-3">
                <span
                  className={`font-black w-10 h-10 flex items-center justify-center rounded-full ${
                    idx === 0
                      ? "bg-yellow-400 text-yellow-900"
                      : idx === 1
                      ? "bg-gray-300 text-gray-700"
                      : idx === 2
                      ? "bg-orange-400 text-orange-900"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {idx + 1}
                </span>

                <span className="font-semibold text-gray-900 text-base break-all">
                  {u.name || getFallbackName(u.email)}
                </span>
              </div>

              <span className="text-orange-600 font-bold text-lg sm:text-xl">
                🔥 {u.current_streak ?? 0}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
