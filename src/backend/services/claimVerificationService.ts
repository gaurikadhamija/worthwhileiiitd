import { db } from '../db/connection.js';
import { OrganizerClaim, ClaimEvidence } from '../types/index.js';

export class ClaimVerificationService {
  static getClaimsForEvent(eventId: string): OrganizerClaim[] {
    const rows = db.prepare(`
      SELECT * FROM organizer_claims WHERE event_id = ?
    `).all(eventId) as any[];

    return rows.map(r => ({
      id: r.id,
      event_id: r.event_id,
      claim_text: r.claim_text,
      claim_category: r.claim_category,
      promised_outcome: r.promised_outcome,
      verification_status: r.verification_status,
      evidence_score: r.evidence_score,
      student_sample_size: r.student_sample_size,
      notes: r.notes
    }));
  }

  static submitEvidence(data: {
    claim_id: string;
    student_id: string;
    confirmed: boolean;
    notes?: string;
  }): { success: boolean; updatedClaim: OrganizerClaim } {
    const evidenceId = `evd_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

    // Insert or replace student evidence
    db.prepare(`
      INSERT OR REPLACE INTO claim_evidence (id, claim_id, student_id, confirmed, notes, created_at)
      VALUES (?, ?, ?, ?, ?, datetime('now'))
    `).run(
      evidenceId,
      data.claim_id,
      data.student_id,
      data.confirmed ? 1 : 0,
      data.notes || null
    );

    // Recompute claim metrics
    const stats = db.prepare(`
      SELECT 
        COUNT(*) as total_samples,
        SUM(CASE WHEN confirmed = 1 THEN 1 ELSE 0 END) as confirmed_count
      FROM claim_evidence
      WHERE claim_id = ?
    `).get(data.claim_id) as { total_samples: number; confirmed_count: number };

    // Also factor in simulated historical baseline for demo realism
    const baseRow = db.prepare('SELECT student_sample_size, evidence_score FROM organizer_claims WHERE id = ?').get(data.claim_id) as any;
    const historicalSamples = baseRow?.student_sample_size || 20;
    const historicalConfirmed = Math.round((baseRow?.evidence_score || 80) * historicalSamples / 100);

    const totalSampleCount = historicalSamples + (stats?.total_samples || 0);
    const totalConfirmedCount = historicalConfirmed + (stats?.confirmed_count || 0);
    const scorePct = Math.round((totalConfirmedCount / totalSampleCount) * 100);

    let status: OrganizerClaim['verification_status'] = 'insufficient_evidence';
    if (totalSampleCount >= 5) {
      if (scorePct >= 80) status = 'verified';
      else if (scorePct >= 50) status = 'partially_verified';
      else status = 'contradicted';
    }

    db.prepare(`
      UPDATE organizer_claims SET
        evidence_score = ?,
        student_sample_size = ?,
        verification_status = ?
      WHERE id = ?
    `).run(scorePct, totalSampleCount, status, data.claim_id);

    const updated = db.prepare('SELECT * FROM organizer_claims WHERE id = ?').get(data.claim_id) as any;

    return {
      success: true,
      updatedClaim: {
        id: updated.id,
        event_id: updated.event_id,
        claim_text: updated.claim_text,
        claim_category: updated.claim_category,
        promised_outcome: updated.promised_outcome,
        verification_status: updated.verification_status,
        evidence_score: updated.evidence_score,
        student_sample_size: updated.student_sample_size,
        notes: updated.notes
      }
    };
  }
}
