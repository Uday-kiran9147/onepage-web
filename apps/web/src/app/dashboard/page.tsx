import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export const metadata: Metadata = {
  title: 'Dashboard — Mirror',
  description: 'View your anonymous feedback and AI-generated patterns.',
};

interface FeedbackAnswer {
  category: string;
  prompt: string;
  text: string;
}

interface FeedbackItem {
  _id: string;
  answers: FeedbackAnswer[];
  createdAt: string;
}

interface PatternItem {
  _id: string;
  category: string;
  summary: string;
  count: number;
}

const CATEGORY_STYLES: Record<string, { bg: string; border: string; label: string; text: string }> = {
  habit: { bg: '#FAECE7', border: '#E05A2B', label: '#993C1D', text: '#3D1B0E' },
  attitude: { bg: '#EEEDFE', border: '#534AB7', label: '#3C3489', text: '#26215C' },
  personality: { bg: '#E1F5EE', border: '#1D9E75', label: '#0F6E56', text: '#0A3D2B' },
};

async function fetchWithAuth(path: string) {
  const cookieStore = cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) return null;

  const res = await fetch(`${API_URL}${path}`, {
    cache: 'no-store',
    headers: {
      Cookie: `token=${token}`,
    },
  });

  if (!res.ok) return null;
  return res.json();
}

export default async function DashboardPage() {
  const cookieStore = cookies();
  const token = cookieStore.get('token')?.value;
  if (!token) redirect('/login');

  const [meData, feedbackData, patternData] = await Promise.all([
    fetchWithAuth('/api/auth/me'),
    fetchWithAuth('/api/feedback'),
    fetchWithAuth('/api/patterns'),
  ]);

  if (!meData) redirect('/login');

  const user = meData.user;
  const feedback: FeedbackItem[] = feedbackData?.feedback || [];
  const patterns: PatternItem[] = patternData?.patterns || [];

  return (
    <main className="min-h-screen px-4 py-12">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <span className="text-xl">🪞</span>
            <span className="font-bold text-lg text-gray-900 tracking-tight">Mirror</span>
          </div>
          <div className="flex gap-2">
            <Link
              href="/settings"
              className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 border border-[#e8e5de] text-sm font-medium transition"
            >
              ⚙️ Settings
            </Link>
            <Link
              href={`/${user.username}`}
              className="px-4 py-2 rounded-xl bg-[#534AB7] hover:bg-[#3C3489] text-white text-sm font-medium transition shadow-sm"
            >
              Public Profile →
            </Link>
          </div>
        </div>

        <div className="label-premium">your private dashboard</div>
        <div className="card-premium mb-8">
          {/* Metrics row */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-[#f4f3ef] rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-gray-900">{feedback.length}</div>
              <div className="text-[11px] text-gray-500 mt-0.5">feedbacks</div>
            </div>
            <div className="bg-[#f4f3ef] rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-gray-900">—</div>
              <div className="text-[11px] text-gray-500 mt-0.5">unique givers</div>
            </div>
            <div className="bg-[#f4f3ef] rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-gray-900">{patterns.length}</div>
              <div className="text-[11px] text-gray-500 mt-0.5">patterns found</div>
            </div>
          </div>

          {/* Pattern Insights */}
          {patterns.length > 0 ? (
            <div className="space-y-2">
              {patterns.map((pattern) => {
                const style = CATEGORY_STYLES[pattern.category] || CATEGORY_STYLES.habit;
                return (
                  <div
                    key={pattern._id}
                    className="rounded-xl px-4 py-3"
                    style={{
                      backgroundColor: style.bg,
                      borderLeft: `3px solid ${style.border}`,
                    }}
                  >
                    <div
                      className="text-[11px] font-bold uppercase tracking-wider mb-0.5"
                      style={{ color: style.label }}
                    >
                      {pattern.category} · {pattern.count} people noticed this
                    </div>
                    <p className="text-sm leading-relaxed" style={{ color: style.text }}>
                      &ldquo;{pattern.summary}&rdquo;
                    </p>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-xs text-gray-500">
              AI clusters similar feedback into <strong className="text-gray-900">patterns</strong> — you see themes, not noise. Patterns appear after 5+ feedbacks.
            </p>
          )}
        </div>

        {/* Share Link */}
        <div className="label-premium">share your feedback link</div>
        <div className="highlight-premium mb-8 flex items-center justify-between">
          <code className="text-sm font-semibold text-[#534AB7]">
            readonepage.xyz/@{user.username}
          </code>
          <span className="text-xs text-[#534AB7]/60">Copy & share →</span>
        </div>

        {/* Recent Feedback */}
        <div className="label-premium">recent feedback</div>
        {feedback.length === 0 ? (
          <div className="card-premium text-center py-8">
            <p className="text-sm text-gray-500 mb-2">No feedback yet.</p>
            <p className="text-xs text-gray-400">Share your link to get started!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {feedback.map((item) => (
              <div key={item._id} className="card-premium">
                <p className="text-[11px] text-gray-400 mb-3 font-medium">
                  {new Date(item.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </p>
                <div className="space-y-3">
                  {item.answers.map((answer, i) => {
                    const style = CATEGORY_STYLES[answer.category] || CATEGORY_STYLES.habit;
                    return (
                      <div key={i}>
                        <span
                          className="text-[10px] font-bold uppercase tracking-wider"
                          style={{ color: style.label }}
                        >
                          {answer.category}
                        </span>
                        <p className="text-sm text-gray-700 mt-0.5 leading-relaxed">{answer.text}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
