"use client";

import { db, collection, getDocs } from "@/lib/firebase_config";
import EmailSearch from "./email-search";
import { useEffect, useState } from "react";
import { limit, orderBy, query } from "firebase/firestore";

export const dynamic = "force-dynamic";

export default function LeaderboardPage() {
  const [sorted, setSorted] = useState<any[]>([]);
  const [top5, setTop5] = useState<any[]>([]);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    async function load() {
      const q = query(
        collection(db, "users"),
        orderBy("current_streak", "desc"),
        limit(5)
      );
      const snap = await getDocs(q);

      const users = snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      })) as Array<{
        id: string;
        name?: string;
        email?: string;
        current_streak?: number;
      }>;

      const sortedUsers = users.sort(
        (a, b) => (b.current_streak ?? 0) - (a.current_streak ?? 0)
      );

      setSorted(sortedUsers);
      setTop5(sortedUsers.slice(0, 5));
    }

    load();
  }, []);

  return (
    <div className="min-h-screen w-full flex justify-center bg-gradient-to-br from-orange-50 via-yellow-50 to-red-50 p-4 sm:p-8">
      <div className="w-full max-w-4xl">

        {/* HEADER */}
        <div className="text-center mb-10 sm:mb-12 px-2">
          <h1 className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600 mb-3">
            🏆 OnePage Hall of Flames 🏆
          </h1>
          <p className="text-gray-700 text-base sm:text-lg font-medium">
            The hottest OnePage readers keeping their streaks alive.
          </p>
        </div>

        {/* TOP 3 */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12 items-end">
          
          {/* SECOND */}
          {top5[1] && (
            <div className="transform hover:scale-105 transition-all duration-300 order-2 sm:order-1">
              <div className="bg-gradient-to-br from-gray-300 to-gray-400 rounded-2xl p-6 shadow-xl border-4 border-gray-500 text-center">
                <div className="text-5xl sm:text-6xl mb-3">🥈</div>
                <div className="text-3xl sm:text-4xl font-black text-white mb-2">2nd</div>

                <div className="bg-white rounded-xl p-4 mb-3">
                  <p className="font-bold text-gray-900 text-lg mb-1">
                    {top5[1].name || "OnePage Rebel"}
                  </p>
                  <p className="text-2xl sm:text-3xl font-black text-orange-600">
                    🔥 {top5[1].current_streak}
                  </p>
                </div>

                <div className="bg-gray-600 text-white font-bold py-2 px-4 rounded-lg text-sm">
                  The OnePage Contender
                </div>
              </div>
            </div>
          )}

          {/* FIRST */}
          {top5[0] && (
            <div className="transform hover:scale-110 transition-all duration-300 -mt-4 sm:-mt-8 order-1 sm:order-2">
              <div className="bg-gradient-to-br from-yellow-300 via-yellow-400 to-yellow-500 rounded-2xl p-6 sm:p-8 shadow-2xl border-4 border-yellow-600 text-center">
                <div className="text-6xl sm:text-7xl mb-3 animate-bounce">👑</div>
                <div className="text-4xl sm:text-5xl font-black text-yellow-900 mb-2">
                  1st
                </div>

                <div className="bg-white rounded-xl p-4 sm:p-5 mb-3 shadow-lg">
                  <p className="font-black text-yellow-900 text-lg sm:text-xl mb-2">
                    {top5[0].name || "OnePage King"}
                  </p>
                  <p className="text-3xl sm:text-4xl font-black text-orange-600">
                    🔥 {top5[0].current_streak}
                  </p>
                </div>

                <div className="bg-yellow-700 text-white font-black py-3 px-6 rounded-lg text-base shadow-lg">
                  🐐 THE ONEPAGE LEGEND 🐐
                </div>
              </div>
            </div>
          )}

          {/* THIRD */}
          {top5[2] && (
            <div className="transform hover:scale-105 transition-all duration-300 order-3 sm:order-3">
              <div className="bg-gradient-to-br from-orange-400 to-orange-500 rounded-2xl p-6 shadow-xl border-4 border-orange-600 text-center">
                <div className="text-5xl sm:text-6xl mb-3">🥉</div>
                <div className="text-3xl sm:text-4xl font-black text-white mb-2">3rd</div>

                <div className="bg-white rounded-xl p-4 mb-3">
                  <p className="font-bold text-gray-900 text-lg mb-1">
                    {top5[2].name || "OnePage Runner"}
                  </p>
                  <p className="text-2xl sm:text-3xl font-black text-orange-600">
                    🔥 {top5[2].current_streak}
                  </p>
                </div>

                <div className="bg-orange-700 text-white font-bold py-2 px-4 rounded-lg text-sm">
                  OnePage Rising Star
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 4 & 5 */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden mb-12">
          <div className="px-4 sm:px-6 py-4 bg-gradient-to-r from-gray-100 to-gray-200 border-b border-gray-300">
            <h3 className="font-bold text-gray-800 text-lg">Next OnePage Warriors</h3>
          </div>

          <div className="divide-y divide-gray-200">
            {top5.slice(3).map((u, index) => {
              const actualIndex = index + 3;
              return (
                <div
                  key={u.id}
                  className="px-4 sm:px-6 py-5 grid grid-cols-4 sm:grid-cols-6 items-center transition-all duration-300 transform hover:scale-[1.02] hover:bg-orange-50 cursor-pointer"
                >
                  <div className="col-span-1">
                    <div
                      className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-black text-lg transition-all ${
                        hoveredIndex === actualIndex
                          ? "bg-orange-500 text-white scale-110"
                          : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {actualIndex + 1}
                    </div>
                  </div>

                  <span className="col-span-2 sm:col-span-3 text-gray-900 font-bold text-base sm:text-lg">
                    {u.name ?? "OnePage Mystery"}
                  </span>

                  <div className="col-span-1 sm:col-span-2 flex items-center justify-end gap-1 sm:gap-2">
                    <span className="text-xl sm:text-2xl font-black text-orange-600">
                      🔥 {u.current_streak}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <EmailSearch users={sorted} />

        <div className="mt-8 text-center p-6 bg-gradient-to-r from-orange-100 to-red-100 rounded-2xl border-2 border-orange-300">
          <p className="text-lg font-bold text-gray-800 mb-2">
            💪 Keep your OnePage streak alive!
          </p>
          <p className="text-gray-700">
            Read one page daily. Stay consistent. Climb the OnePage leaderboard.
          </p>
        </div>
      </div>
    </div>
  );
}
