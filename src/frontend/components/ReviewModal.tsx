import React, { useState } from 'react';
import { X, Star, CheckCircle, Clock, ShieldCheck } from 'lucide-react';
import { useApp } from '../context/AppContext.js';
import { api } from '../services/api.js';

const QUICK_TAGS = [
  'Hands-on',
  'Good for resume',
  'Great networking',
  'Worth attending',
  'Beginner friendly',
  'Free food',
  'Great for first-years',
  'Long queues',
  'Started late',
  'Heavy sales pitch'
];

export const ReviewModal: React.FC = () => {
  const { reviewModalEvent, setReviewModalEvent, refreshData } = useApp();

  const [ratings, setRatings] = useState({
    content: 5,
    speaker: 5,
    networking: 4,
    timeSpent: 5,
    logistics: 4
  });

  const [selectedTags, setSelectedTags] = useState<string[]>(['Hands-on', 'Good for resume']);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!reviewModalEvent) return null;

  const handleRatingChange = (category: keyof typeof ratings, val: number) => {
    setRatings(prev => ({ ...prev, [category]: val }));
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.submitReview({
        event_id: reviewModalEvent.id,
        rating_content: ratings.content,
        rating_speaker: ratings.speaker,
        rating_networking: ratings.networking,
        rating_time_spent: ratings.timeSpent,
        rating_logistics: ratings.logistics,
        comment: comment.trim() || undefined,
        tags: selectedTags
      });
      setSubmitted(true);
      setTimeout(async () => {
        await refreshData();
        setReviewModalEvent(null);
        setSubmitted(false);
      }, 1400);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (category: keyof typeof ratings, currentVal: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map(star => (
          <button
            key={star}
            type="button"
            onClick={() => handleRatingChange(category, star)}
            className="p-1 text-[#E8DCC8] hover:text-[#6B1E23] transition-colors"
          >
            <Star
              className={`w-5 h-5 ${
                star <= currentVal ? 'text-[#6B1E23] fill-[#6B1E23]' : 'text-[#E8DCC8]'
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-xl bg-[#FAF4EB] rounded-2xl border border-[#D8C5AE] shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
        <button
          onClick={() => setReviewModalEvent(null)}
          className="absolute top-5 right-5 p-2 rounded-full text-[#5A3828] hover:bg-[#F4EBDD] transition-colors"
          aria-label="Close review dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="py-12 text-center">
            <div className="w-14 h-14 bg-[#2D6A4F]/10 text-[#2D6A4F] rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-serif font-bold text-[#2A1B16]">
              Review & Evidence Submitted!
            </h3>
            <p className="text-xs text-[#5A3828] mt-2 max-w-md mx-auto">
              Your feedback is verified and directly impacts organizer trust metrics and future student relevance calculations.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-[#6B1E23] mb-1">
              <Clock className="w-3.5 h-3.5" />
              <span>30-Second Student Review</span>
            </div>

            <h2 className="text-2xl font-serif font-bold text-[#2A1B16] leading-tight">
              How was it?
            </h2>
            <p className="text-xs text-[#5A3828] mt-0.5 truncate">
              {reviewModalEvent.title}
            </p>

            <div className="inline-flex items-center gap-1.5 mt-2 px-2.5 py-1 rounded-md bg-[#2D6A4F]/10 text-[#2D6A4F] text-[11px] font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>✓ Verified Attendee Badge will be displayed</span>
            </div>

            {/* 5-Dimension Rating Grid */}
            <div className="mt-5 space-y-3 bg-[#F4EBDD]/50 p-4 rounded-xl border border-[#E8DCC8]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-[#2A1B16]">Content Quality</span>
                {renderStars('content', ratings.content)}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-[#2A1B16]">Speaker / Mentors</span>
                {renderStars('speaker', ratings.speaker)}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-[#2A1B16]">Networking Quality</span>
                {renderStars('networking', ratings.networking)}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-[#2A1B16]">Time Well Spent</span>
                {renderStars('timeSpent', ratings.timeSpent)}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-[#2A1B16]">Logistics & Punctuality</span>
                {renderStars('logistics', ratings.logistics)}
              </div>
            </div>

            {/* Quick Tags */}
            <div className="mt-5">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#2A1B16] block mb-2">
                Quick Tags (Select all that apply)
              </label>
              <div className="flex flex-wrap gap-1.5">
                {QUICK_TAGS.map(tag => {
                  const active = selectedTags.includes(tag);
                  const isNegative = tag === 'Long queues' || tag === 'Started late' || tag === 'Heavy sales pitch';
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleTag(tag)}
                      className={`px-2.5 py-1 rounded-lg border text-xs font-medium transition-colors ${
                        active
                          ? isNegative
                            ? 'bg-[#9A1B28] text-white border-[#9A1B28]'
                            : 'bg-[#2C0F12] text-[#FFFDF8] border-[#2C0F12]'
                          : 'bg-[#FFFDF8] text-[#5A3828] border-[#E8DCC8] hover:border-[#6B1E23]/40'
                      }`}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Optional Comment */}
            <div className="mt-4">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#2A1B16] block mb-1">
                Optional Insight for Peers
              </label>
              <textarea
                value={comment}
                onChange={e => setComment(e.target.value)}
                placeholder="What was the single best takeaway or unexpected catch?"
                rows={2}
                className="w-full rounded-xl border border-[#E8DCC8] bg-[#FFFDF8] p-3 text-xs text-[#2A1B16] placeholder:text-[#5A3828]/50 focus:outline-none focus:border-[#6B1E23]"
              />
            </div>

            {/* Actions */}
            <div className="mt-5 pt-4 border-t border-[#E8DCC8] flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setReviewModalEvent(null)}
                className="px-4 py-2 text-xs font-medium text-[#5A3828]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2.5 rounded-xl bg-[#2C0F12] text-[#FFFDF8] text-xs font-semibold hover:bg-[#6B1E23] transition-colors"
              >
                {submitting ? 'Submitting...' : 'Post 30-Sec Review'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
