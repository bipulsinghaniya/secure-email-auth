Signup
 → User saved in MongoDB (emailVerified = false)
 → Verification token saved in Redis (10 min)
 → Email link sent
 → User clicks link
 → Redis token validated
 → MongoDB updated (emailVerified = true)
 → Token auto-deleted
