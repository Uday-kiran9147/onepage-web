'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FeedbackSubmitSchema, type FeedbackSubmit } from '@mirror/shared';
import Link from 'next/link';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

const PROMPTS = [
  {
    category: 'habit' as const,
    prompt: "What's one habit of theirs you silently wish they'd change?",
    helperText: "e.g., 'You often interrupt when others are speaking,' or 'You check your phone constantly during dinner.'",
    color: { label: '#534AB7', bg: '#EEEDFE', dot: '●' },
  },
  {
    category: 'attitude' as const,
    prompt: 'How do they make people around them feel? Be specific.',
    helperText: "Think about their energy. e.g., 'You make people feel safe to share ideas,' or 'You can be intimidating under pressure.'",
    color: { label: '#0F6E56', bg: '#E1F5EE', dot: '●' },
  },
  {
    category: 'personality' as const,
    prompt: "What's one thing they do that makes you genuinely admire them?",
    helperText: "e.g., 'Your unshakeable optimism when things go wrong,' or 'How you always remember the small details about people.'",
    color: { label: '#854F0B', bg: '#FAEEDA', dot: '●' },
  },
];

export default function GiveFeedbackPage({
  params,
}: {
  params: { username: string };
}) {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<FeedbackSubmit>({
    resolver: zodResolver(FeedbackSubmitSchema),
    mode: 'onChange',
    defaultValues: {
      answers: PROMPTS.map((p) => ({
        category: p.category,
        prompt: p.prompt,
        text: '',
      })),
    },
  });

  const answers = watch('answers');

  const onSubmit = async (data: FeedbackSubmit) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_URL}/api/feedback/${params.username}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.message || 'Something went wrong');
      }

      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 rounded-full bg-[#E1F5EE] border border-[#80C8B0] flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">✨</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Feedback Sent!</h1>
          <p className="text-sm text-gray-500 leading-relaxed mb-6">
            Your anonymous feedback has been submitted. It will be reviewed by AI moderation
            before being shown to @{params.username}.
          </p>
          <Link
            href={`/${params.username}`}
            className="inline-block px-6 py-2.5 rounded-full bg-[#534AB7] text-white text-sm font-semibold hover:bg-[#3C3489] transition"
          >
            Back to Profile
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-4 py-12">
      <div className="max-w-xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-2 mb-8">
          <span className="text-lg">🪞</span>
          <span className="font-bold text-gray-900 text-sm">Mirror</span>
        </div>

        <Link
          href={`/${params.username}`}
          className="text-xs font-semibold text-gray-400 hover:text-gray-600 transition mb-6 inline-block"
        >
          ← Back to @{params.username}
        </Link>

        <div className="card-premium mb-6">
          <p className="text-sm text-gray-500 leading-relaxed">
            Instead of a blank text box, answer <strong className="text-gray-900">structured prompts</strong>.
            This gets specific, actionable feedback — not &quot;ur nice lol&quot;.
          </p>
        </div>

        {error && (
          <div className="mb-6 px-4 py-3 rounded-xl bg-[#FAECE7] border border-[#E05A2B]/30 text-[#B23D19] text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {PROMPTS.map((prompt, index) => {
            const textLength = answers?.[index]?.text?.length || 0;
            const isMet = textLength >= 50;

            return (
              <div
                key={prompt.category}
                className="border border-[#e8e5de] rounded-2xl p-5 bg-[#f9f8f5]"
              >
                {/* Category label with colored dot */}
                <div
                  className="text-[11px] font-bold uppercase tracking-wider mb-2"
                  style={{ color: prompt.color.label }}
                >
                  {prompt.color.dot} {prompt.category}
                </div>
                <p className="text-sm font-semibold text-gray-900 mb-3">
                  {prompt.prompt}
                </p>
                
                <textarea
                  {...register(`answers.${index}.text`)}
                  rows={3}
                  placeholder="Write honestly. They won't know it's you."
                  className={`w-full px-4 py-3 rounded-xl bg-white border ${isMet ? 'border-[#80C8B0] focus:ring-[#1D9E75]' : 'border-[#e8e5de] focus:ring-[#AFA9EC]'} text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:border-transparent transition resize-none`}
                />
                
                <div className="flex flex-col sm:flex-row sm:items-start justify-between mt-2 gap-2">
                  <p className="text-[11px] text-gray-500 italic max-w-sm">
                    {prompt.helperText}
                  </p>
                  <div className={`text-[11px] font-bold shrink-0 px-2 py-1 rounded-md ${isMet ? 'bg-[#E1F5EE] text-[#0F6E56]' : 'bg-gray-100 text-gray-400'}`}>
                    {textLength} / 50
                  </div>
                </div>

                {/* Hidden fields */}
                <input type="hidden" {...register(`answers.${index}.category`)} />
                <input type="hidden" {...register(`answers.${index}.prompt`)} />
                {errors.answers?.[index]?.text && (
                  <p className="mt-2 text-xs text-[#B23D19] font-medium">
                    {errors.answers[index]?.text?.message}
                  </p>
                )}
              </div>
            );
          })}

          <p className="text-xs text-gray-400 pt-1">
            Takes ~3 minutes. No account needed. Min 50 characters per answer.
          </p>

          <button
            type="submit"
            disabled={loading || !isValid}
            className="w-full py-3.5 rounded-2xl bg-[#534AB7] text-white font-semibold text-sm hover:bg-[#3C3489] transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed mt-2"
          >
            {loading ? 'Submitting...' : 'Submit Anonymous Feedback'}
          </button>
        </form>
      </div>
    </main>
  );
}
