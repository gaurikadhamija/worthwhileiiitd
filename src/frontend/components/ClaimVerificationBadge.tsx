import React from 'react';
import { CheckCircle2, AlertTriangle, XCircle, ShieldCheck } from 'lucide-react';
import { OrganizerClaim } from '../types/index.js';

interface Props {
  claim: OrganizerClaim;
  compact?: boolean;
}

export const ClaimVerificationBadge: React.FC<Props> = ({ claim, compact = false }) => {
  const isVerified = claim.verification_status === 'verified';
  const isPartial = claim.verification_status === 'partially_verified';
  const isContradicted = claim.verification_status === 'contradicted';

  const badgeConfig = isVerified
    ? {
        label: 'VERIFIED',
        icon: CheckCircle2,
        color: 'text-[#2D6A4F]',
        bg: 'bg-[#2D6A4F]/10',
        border: 'border-[#2D6A4F]/30',
        barColor: 'bg-[#2D6A4F]'
      }
    : isPartial
    ? {
        label: 'PARTIALLY VERIFIED',
        icon: AlertTriangle,
        color: 'text-[#B9770E]',
        bg: 'bg-[#B9770E]/10',
        border: 'border-[#B9770E]/30',
        barColor: 'bg-[#B9770E]'
      }
    : {
        label: 'CONTRADICTED',
        icon: XCircle,
        color: 'text-[#9A1B28]',
        bg: 'bg-[#9A1B28]/10',
        border: 'border-[#9A1B28]/30',
        barColor: 'bg-[#9A1B28]'
      };

  const Icon = badgeConfig.icon;

  if (compact) {
    return (
      <div className="inline-flex items-center gap-1.5 text-xs font-medium" title={`${claim.evidence_score}% student confirmation (${claim.student_sample_size} responses)`}>
        <Icon className={`w-3.5 h-3.5 ${badgeConfig.color}`} />
        <span className={`font-semibold tracking-wider text-[11px] ${badgeConfig.color}`}>
          {badgeConfig.label}
        </span>
        <span className="text-[#5A3828]/70 text-[11px]">
          ({claim.evidence_score}% by {claim.student_sample_size} students)
        </span>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-[#D8C5AE] bg-[#FAF4EB] p-4 transition-all hover:border-[#6B1E23]/40 shadow-xs">
      <div className="flex items-start justify-between gap-3 mb-2">
        <div>
          <span className="text-[10px] uppercase tracking-wider text-[#6B1E23] font-semibold">
            Organizer Claim
          </span>
          <p className="text-sm font-medium text-[#2A1B16] mt-0.5">
            "{claim.claim_text}"
          </p>
        </div>

        <div className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md border text-[11px] font-semibold uppercase tracking-wider ${badgeConfig.bg} ${badgeConfig.color} ${badgeConfig.border}`}>
          <Icon className="w-3.5 h-3.5" />
          <span>{badgeConfig.label}</span>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-[#F4EBDD] flex items-center justify-between text-xs text-[#5A3828]">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#6B1E23]" />
          <span>
            <strong className="font-semibold text-[#2A1B16]">{claim.evidence_score}%</strong> student confirmation
          </span>
          <span>·</span>
          <span>{claim.student_sample_size} verified attendees surveyed</span>
        </div>

        {claim.notes && (
          <span className="text-[11px] text-[#5A3828]/80 italic max-w-xs truncate" title={claim.notes}>
            {claim.notes}
          </span>
        )}
      </div>

      {/* Confirmation progress bar */}
      <div className="mt-2 w-full bg-[#E8DCC8]/60 h-1.5 rounded-full overflow-hidden">
        <div
          className={`h-full ${badgeConfig.barColor} transition-all duration-700`}
          style={{ width: `${claim.evidence_score}%` }}
        />
      </div>
    </div>
  );
};
