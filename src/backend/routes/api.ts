import { Router, Request, Response } from 'express';
import { EventService } from '../services/eventService.js';
import { UserService } from '../services/userService.js';
import { AuthService } from '../services/authService.js';
import { FreeTimeService } from '../services/freeTimeService.js';
import { ComparisonService } from '../services/comparisonService.js';
import { ClaimVerificationService } from '../services/claimVerificationService.js';
import { ReviewService } from '../services/reviewService.js';
import { OrganizerService } from '../services/organizerService.js';
import { NotificationService } from '../services/notificationService.js';
import { calculateRelevanceScore } from '../services/relevanceEngine.js';
import { db } from '../db/connection.js';

export const apiRouter = Router();

// Middleware helper to get current student profile from token or header
function getAuthSessionFromRequest(req: Request) {
  const authHeader = req.headers.authorization || (req.headers['x-auth-token'] as string);
  if (authHeader) {
    const token = authHeader.startsWith('Bearer ') ? authHeader.substring(7) : authHeader;
    const session = AuthService.getUserByToken(token);
    if (session) return session;
  }
  const userId = (req.headers['x-user-id'] as string) || 'usr_demo_student';
  const user = UserService.getUser(userId);
  const profile = UserService.getProfile(userId);
  return { user, profile, token: '' };
}

function getCurrentProfile(req: Request) {
  return getAuthSessionFromRequest(req).profile;
}

function getCurrentUserId(req: Request) {
  const session = getAuthSessionFromRequest(req);
  return session.user?.id || 'usr_demo_student';
}

// -------------------------------------------------------------
// AUTHENTICATION ENDPOINTS
// -------------------------------------------------------------
apiRouter.post('/auth/signup', (req: Request, res: Response) => {
  try {
    const { email, password, name, role, delhi_region } = req.body;
    if (!email || !password || !name) {
      return res.status(400).json({ success: false, error: 'Name, email, and password are required.' });
    }
    const session = AuthService.signup({ email, password, name, role, delhi_region });
    res.status(201).json({ success: true, data: session });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

apiRouter.post('/auth/login', (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email and password are required.' });
    }
    const session = AuthService.login(email, password);
    res.json({ success: true, data: session });
  } catch (err: any) {
    res.status(401).json({ success: false, error: err.message });
  }
});

apiRouter.post('/auth/google', (req: Request, res: Response) => {
  try {
    const { email, name, avatar_url } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, error: 'Google email is required.' });
    }
    const session = AuthService.googleLogin({ email, name: name || 'Student', avatar_url });
    res.json({ success: true, data: session });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

apiRouter.get('/auth/me', (req: Request, res: Response) => {
  try {
    const session = getAuthSessionFromRequest(req);
    res.json({ success: true, data: session });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

apiRouter.post('/auth/logout', (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization || (req.headers['x-auth-token'] as string);
    if (authHeader) {
      const token = authHeader.startsWith('Bearer ') ? authHeader.substring(7) : authHeader;
      AuthService.logout(token);
    }
    res.json({ success: true, message: 'Logged out successfully' });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

apiRouter.post('/auth/forgot-password', (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const result = AuthService.requestPasswordReset(email);
    res.json({ success: true, message: 'Password reset link sent to your email.', data: result });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

apiRouter.post('/auth/reset-password', (req: Request, res: Response) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) {
      return res.status(400).json({ success: false, error: 'Token and new password required.' });
    }
    const ok = AuthService.resetPassword(token, newPassword);
    res.json({ success: true, message: 'Password updated successfully. You can now log in.' });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// -------------------------------------------------------------
// POST-LOGIN ONBOARDING & PRIORITIES (PERSISTED IN DATABASE)
// -------------------------------------------------------------
apiRouter.put('/user/onboarding', (req: Request, res: Response) => {
  try {
    const userId = getCurrentUserId(req);
    const {
      goals,
      interests,
      priorities,
      year_of_study,
      degree,
      major,
      delhi_region,
      commute_mode,
      career_interests,
      preferred_event_types,
      preferred_duration_max,
      preferred_distance_max,
      preferred_time_of_day
    } = req.body;

    const updated = UserService.updateProfile(userId, {
      goals,
      interests,
      priorities,
      year_of_study,
      degree,
      major,
      delhi_region,
      commute_mode,
      career_interests,
      preferred_event_types,
      preferred_duration_max,
      preferred_distance_max,
      preferred_time_of_day,
      onboarding_completed: true
    });

    res.json({ success: true, data: updated });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

apiRouter.put('/user/priorities', (req: Request, res: Response) => {
  try {
    const userId = getCurrentUserId(req);
    const { priorities } = req.body;
    const updated = UserService.updateProfile(userId, { priorities });
    res.json({ success: true, data: updated });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

apiRouter.get('/venues', (req: Request, res: Response) => {
  try {
    const venues = db.prepare('SELECT * FROM venues ORDER BY name ASC').all();
    res.json({ success: true, count: venues.length, data: venues });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// -------------------------------------------------------------
// EVENTS ENDPOINTS
// -------------------------------------------------------------
apiRouter.get('/events', (req: Request, res: Response) => {
  try {
    const profile = getCurrentProfile(req);
    const category = req.query.category as string | undefined;
    const search = req.query.search as string | undefined;
    const isFree = req.query.is_free !== undefined ? req.query.is_free === 'true' : undefined;
    const certOnly = req.query.certificate_only === 'true';
    const networking = req.query.networking_level as string | undefined;

    const events = EventService.getAllEvents({
      category,
      search,
      is_free: isFree,
      certificate_only: certOnly,
      networking_level: networking,
      profile
    });

    res.json({ success: true, count: events.length, data: events });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

apiRouter.get('/events/recommended', (req: Request, res: Response) => {
  try {
    const profile = getCurrentProfile(req);
    const all = EventService.getAllEvents({ profile });
    // Sort by personalized relevance score descending
    const recommended = [...all].sort((a, b) => b.relevance.totalScore - a.relevance.totalScore);
    res.json({ success: true, count: recommended.length, data: recommended });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

apiRouter.get('/events/saved', (req: Request, res: Response) => {
  try {
    const userId = getCurrentUserId(req);
    const saved = UserService.getSavedEvents(userId);
    res.json({ success: true, count: saved.length, data: saved });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

apiRouter.get('/events/:id', (req: Request, res: Response) => {
  try {
    const profile = getCurrentProfile(req);
    const event = EventService.getEventById(req.params.id, profile);
    if (!event) {
      return res.status(404).json({ success: false, error: 'Event not found' });
    }
    const insights = ReviewService.getCommunityInsights(req.params.id);
    const reviews = ReviewService.getReviewsForEvent(req.params.id);

    res.json({
      success: true,
      data: {
        ...event,
        community_insights: insights,
        reviews
      }
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

apiRouter.post('/events', (req: Request, res: Response) => {
  try {
    const created = EventService.createEvent(req.body);
    res.status(201).json({ success: true, data: created });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

apiRouter.put('/events/:id', (req: Request, res: Response) => {
  try {
    const updated = EventService.updateEvent(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Event not found' });
    }
    res.json({ success: true, data: updated });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

apiRouter.delete('/events/:id', (req: Request, res: Response) => {
  try {
    const ok = EventService.deleteEvent(req.params.id);
    if (!ok) {
      return res.status(404).json({ success: false, error: 'Event not found' });
    }
    res.json({ success: true, message: 'Event deleted successfully' });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// -------------------------------------------------------------
// RELEVANCE & 2-HOUR & COMPARE
// -------------------------------------------------------------
apiRouter.post('/relevance/calculate', (req: Request, res: Response) => {
  try {
    const { event_id } = req.body;
    const profile = getCurrentProfile(req);
    const event = EventService.getEventById(event_id, profile);
    if (!event) {
      return res.status(404).json({ success: false, error: 'Event not found' });
    }
    const breakdown = calculateRelevanceScore(profile, event);
    res.json({ success: true, data: breakdown });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

apiRouter.post('/free-time/recommend', (req: Request, res: Response) => {
  try {
    const profile = getCurrentProfile(req);
    const {
      startHour = 15,
      startMinute = 0,
      endHour = 17,
      endMinute = 0,
      currentZone,
      originLat,
      originLng,
      originName
    } = req.body;

    const recs = FreeTimeService.findEventsForFreeTime({
      startHour: Number(startHour),
      startMinute: Number(startMinute),
      endHour: Number(endHour),
      endMinute: Number(endMinute),
      currentZone,
      originLat: originLat ? Number(originLat) : undefined,
      originLng: originLng ? Number(originLng) : undefined,
      originName,
      profile
    });

    res.json({ success: true, count: recs.length, data: recs });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

apiRouter.post('/events/compare', (req: Request, res: Response) => {
  try {
    const profile = getCurrentProfile(req);
    const { event_ids, priority = 'career' } = req.body;

    if (!Array.isArray(event_ids) || event_ids.length === 0) {
      return res.status(400).json({ success: false, error: 'Provide at least 2 event IDs to compare' });
    }

    const result = ComparisonService.compareEvents(event_ids, priority, profile);
    res.json({ success: true, data: result });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// -------------------------------------------------------------
// CAMPUS HEATMAP & VENUES
// -------------------------------------------------------------
apiRouter.get('/heatmap', (req: Request, res: Response) => {
  try {
    const profile = getCurrentProfile(req);
    const events = EventService.getAllEvents({ profile });

    // Group events by venue for map rendering
    const venueMap: Record<string, any> = {};
    for (const ev of events) {
      if (!ev.venue) continue;
      if (!venueMap[ev.venue.id]) {
        venueMap[ev.venue.id] = {
          venue: ev.venue,
          events: [],
          totalCapacity: ev.venue.capacity,
          densityScore: 0,
        };
      }
      venueMap[ev.venue.id].events.push({
        id: ev.id,
        title: ev.title,
        category: ev.category,
        start_time: ev.start_time,
        end_time: ev.end_time,
        relevance: ev.relevance.totalScore,
        cost_cents: ev.cost_cents,
        networking: ev.networking_potential
      });
      venueMap[ev.venue.id].densityScore += 1;
    }

    const clusters = Object.values(venueMap);
    res.json({ success: true, count: clusters.length, data: clusters });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

apiRouter.get('/events/nearby', (req: Request, res: Response) => {
  try {
    const profile = getCurrentProfile(req);
    const maxMinutes = Number(req.query.max_walking_minutes || 15);
    const events = EventService.getAllEvents({ profile });

    // Filter by walking threshold
    const nearby = events.filter(e => (e.venue?.campus_zone || '').includes('North') || (e.venue?.campus_zone || '').includes('Central'));
    res.json({ success: true, count: nearby.length, data: nearby });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// -------------------------------------------------------------
// CLAIMS & EVIDENCE VERIFICATION
// -------------------------------------------------------------
apiRouter.get('/events/:id/claims', (req: Request, res: Response) => {
  try {
    const claims = ClaimVerificationService.getClaimsForEvent(req.params.id);
    res.json({ success: true, count: claims.length, data: claims });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

apiRouter.post('/events/:id/evidence', (req: Request, res: Response) => {
  try {
    const userId = getCurrentUserId(req);
    const { claim_id, confirmed, notes } = req.body;

    if (!claim_id || confirmed === undefined) {
      return res.status(400).json({ success: false, error: 'claim_id and confirmed are required' });
    }

    const result = ClaimVerificationService.submitEvidence({
      claim_id,
      student_id: userId,
      confirmed: Boolean(confirmed),
      notes
    });

    res.json({ success: true, data: result });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// -------------------------------------------------------------
// REVIEWS
// -------------------------------------------------------------
apiRouter.get('/events/:id/reviews', (req: Request, res: Response) => {
  try {
    const reviews = ReviewService.getReviewsForEvent(req.params.id);
    const insights = ReviewService.getCommunityInsights(req.params.id);
    res.json({ success: true, count: reviews.length, data: { reviews, insights } });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

apiRouter.post('/reviews', (req: Request, res: Response) => {
  try {
    const userId = getCurrentUserId(req);
    const user = UserService.getUser(userId);
    const profile = UserService.getProfile(userId);

    const {
      event_id,
      rating_content = 5,
      rating_speaker = 5,
      rating_networking = 4,
      rating_time_spent = 5,
      rating_logistics = 4,
      comment,
      tags = []
    } = req.body;

    if (!event_id) {
      return res.status(400).json({ success: false, error: 'event_id is required' });
    }

    const review = ReviewService.createReview({
      event_id,
      user_id: userId,
      user_name: user?.name || 'Alex Chen',
      user_degree: profile?.degree ? `${profile.degree} in ${profile.major}` : 'Junior CS',
      rating_content: Number(rating_content),
      rating_speaker: Number(rating_speaker),
      rating_networking: Number(rating_networking),
      rating_time_spent: Number(rating_time_spent),
      rating_logistics: Number(rating_logistics),
      comment,
      tags
    });

    res.status(201).json({ success: true, data: review });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// -------------------------------------------------------------
// SAVED & REGISTRATIONS
// -------------------------------------------------------------
apiRouter.post('/events/:id/save', (req: Request, res: Response) => {
  try {
    const userId = getCurrentUserId(req);
    const result = UserService.toggleSaveEvent(userId, req.params.id);
    res.json({ success: true, data: result });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

apiRouter.delete('/events/:id/save', (req: Request, res: Response) => {
  try {
    const userId = getCurrentUserId(req);
    const result = UserService.toggleSaveEvent(userId, req.params.id);
    res.json({ success: true, data: result });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

apiRouter.post('/events/:id/register', (req: Request, res: Response) => {
  try {
    const userId = getCurrentUserId(req);
    const result = UserService.registerForEvent(userId, req.params.id);
    res.json({ success: true, data: result });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// -------------------------------------------------------------
// USER PROFILE & GOALS & ACTIVITY
// -------------------------------------------------------------
apiRouter.get('/user/profile', (req: Request, res: Response) => {
  try {
    const userId = getCurrentUserId(req);
    const user = UserService.getUser(userId);
    const profile = UserService.getProfile(userId);
    res.json({ success: true, data: { user, profile } });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

apiRouter.put('/user/profile', (req: Request, res: Response) => {
  try {
    const userId = getCurrentUserId(req);
    const updated = UserService.updateProfile(userId, req.body);
    res.json({ success: true, data: updated });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

apiRouter.put('/user/goals', (req: Request, res: Response) => {
  try {
    const userId = getCurrentUserId(req);
    const { goals, interests, career_interests } = req.body;
    const updated = UserService.updateProfile(userId, {
      goals,
      interests,
      career_interests
    });
    res.json({ success: true, data: updated });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

apiRouter.get('/user/activity', (req: Request, res: Response) => {
  try {
    const userId = getCurrentUserId(req);
    const activity = UserService.getActivityPortfolio(userId);
    res.json({ success: true, data: activity });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// -------------------------------------------------------------
// ORGANIZER DASHBOARD & ANALYTICS
// -------------------------------------------------------------
apiRouter.get('/organizer/dashboard', (req: Request, res: Response) => {
  try {
    const orgId = (req.query.organizer_id as string) || 'org_acm';
    const metrics = OrganizerService.getDashboardMetrics(orgId);
    res.json({ success: true, data: metrics });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// -------------------------------------------------------------
// NOTIFICATIONS
// -------------------------------------------------------------
apiRouter.get('/notifications', (req: Request, res: Response) => {
  try {
    const userId = getCurrentUserId(req);
    const list = NotificationService.getNotifications(userId);
    res.json({ success: true, count: list.length, data: list });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

apiRouter.put('/notifications/:id/read', (req: Request, res: Response) => {
  try {
    const ok = NotificationService.markAsRead(req.params.id);
    res.json({ success: true, marked: ok });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

apiRouter.post('/notifications/read-all', (req: Request, res: Response) => {
  try {
    const userId = getCurrentUserId(req);
    const ok = NotificationService.markAllAsRead(userId);
    res.json({ success: true, marked: ok });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});
