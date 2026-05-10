# Joblify API Documentation

Base URL: `https://your-domain.com/api`

---

## Table of Contents

1. [Authentication](#1-authentication)
2. [Social Authentication](#2-social-authentication)
3. [Email Verification](#3-email-verification)
4. [Password Reset](#4-password-reset)
5. [Profile](#5-profile)
6. [Jobs](#6-jobs)
7. [Applications](#7-applications)
8. [Comments](#8-comments)
9. [Categories & Skills](#9-categories--skills)
10. [Notifications](#10-notifications)
11. [Company](#11-company)
12. [Employer Analytics](#12-employer-analytics)
13. [Admin](#13-admin)
14. [Enums Reference](#14-enums-reference)
15. [Standard Response Format](#15-standard-response-format)

---

## Authentication

All authenticated endpoints require a `Bearer` token in the `Authorization` header:

```
Authorization: Bearer 1|abc123...
```

### `POST /register`

Create a new user account.

**Request body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "password_confirmation": "password123",
  "role": "candidate",
  "phone": "+201234567890",
  "linkedin_url": "https://linkedin.com/in/johndoe"
}
```

**Validation rules:**
| Field | Rules |
|-------|-------|
| `name` | required, string, max:255 |
| `email` | required, email, max:255, unique |
| `password` | required, confirmed, min:8 |
| `role` | required, in: `candidate`, `employer` |
| `phone` | nullable, string, max:20 |
| `linkedin_url` | nullable, url, max:255 |

**Response `201`:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "role": "candidate",
      "phone": "+201234567890",
      "linkedin_url": "https://linkedin.com/in/johndoe"
    },
    "access_token": "1|abc123...",
    "token_type": "Bearer"
  }
}
```

### `POST /login`

Authenticate with existing credentials.

**Request body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response `200`:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": { "id": 1, "name": "John Doe", "email": "john@example.com", "role": "candidate" },
    "access_token": "1|abc123..."
  }
}
```

**Response `401` (invalid credentials):**
```json
{
  "success": false,
  "message": "Invalid login credentials"
}
```

### `POST /logout`

Revoke the current access token. Requires auth.

**Response `204`:** No content.

### `GET /user`

Get the authenticated user's basic info. Requires auth.

**Response `200`:**
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "role": "candidate",
  "phone": "+201234567890",
  "linkedin_url": "https://linkedin.com/in/johndoe",
  "email_verified_at": "2026-05-09T12:00:00.000000Z",
  "created_at": "2026-05-09T12:00:00.000000Z",
  "updated_at": "2026-05-09T12:00:00.000000Z"
}
```

---

## Social Authentication

### `GET /auth/google/redirect`

Initiate Google OAuth login. **Public.**

**Query parameters:**
| Param | Type | Description |
|-------|------|-------------|
| `role` | string | Optional. `candidate` (default) or `employer` |

**Response:** Redirects to Google consent screen.

### `GET /auth/google/callback`

Google OAuth callback. **Public.**

**Response `200`:**
```json
{
  "success": true,
  "message": "Login successful via Google",
  "data": {
    "user": { "id": 1, "name": "John Doe", "email": "john@example.com", "role": "candidate" },
    "access_token": "1|abc123..."
  }
}
```

**Response `401`:**
```json
{
  "success": false,
  "message": "Google authentication failed"
}
```

### `GET /auth/github/redirect`

Initiate GitHub OAuth login. **Public.**

**Query parameters:**
| Param | Type | Description |
|-------|------|-------------|
| `role` | string | Optional. `candidate` (default) or `employer` |

**Response:** Redirects to GitHub consent screen.

### `GET /auth/github/callback`

GitHub OAuth callback. **Public.**

**Response `200`:**
```json
{
  "success": true,
  "message": "Login successful via GitHub",
  "data": {
    "user": { "id": 1, "name": "John Doe", "email": "john@example.com", "role": "candidate" },
    "access_token": "1|abc123..."
  }
}
```

**Response `401`:**
```json
{
  "success": false,
  "message": "GitHub authentication failed"
}
```

---

## Email Verification

New users receive a verification email on registration. The verification link is a signed URL.

### `GET /email/verify/{id}/{hash}`

Verify email address via signed link (no auth header needed).

**Response `200` (already verified):**
```json
{ "message": "Email already verified" }
```

**Response `200` (successfully verified):**
```json
{ "message": "Email has been verified successfully" }
```

**Response `403`:**
```json
{ "message": "Unauthorized or invalid hash" }
```

### `POST /email/verification-notification`

Resend the verification email. Requires auth.

**Response `200`:**
```json
{ "message": "Verification link sent" }
```

---

## Password Reset

### `POST /forgot-password`

Request a password reset link.

**Request body:**
```json
{ "email": "john@example.com" }
```

**Response `200`:**
```json
{ "message": "We have emailed your password reset link." }
```

**Response `400` (invalid email):**
```json
{ "email": "We can't find a user with that email address." }
```

### `POST /reset-password`

Reset the password using the token from the email.

**Request body:**
```json
{
  "token": "reset-token-from-email",
  "email": "john@example.com",
  "password": "newpassword123",
  "password_confirmation": "newpassword123"
}
```

**Response `200`:**
```json
{ "message": "Your password has been reset." }
```

**Response `400` (invalid token/email):**
```json
{ "email": "This password reset token is invalid." }
```

---

## Profile

All profile endpoints require `auth:sanctum`. Update/download resume also require `verified`.

### `GET /profile`

Show the authenticated user's profile.

**Response `200`:**
```json
{
  "success": true,
  "data": {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+201234567890",
    "linkedin_url": "https://linkedin.com/in/johndoe",
    "applications_count": 5,
    "has_resume": true
  }
}
```

### `POST /profile`

Update profile (requires `verified` middleware).

**Request body (multipart/form-data):**
| Field | Rules |
|-------|-------|
| `name` | required, string, max:255 |
| `phone` | nullable, string, max:20 |
| `linkedin_url` | nullable, url |
| `resume` | nullable, file, mimes:pdf,doc,docx, max:5120 (5MB) |

**Response `200`:**
```json
{
  "success": true,
  "message": "Profile updated successfully"
}
```

### `GET /profile/resume`

Download the user's resume file (requires `verified` middleware).

**Response:** File download stream.  
**Response `404`:**
```json
{ "message": "Resume not found" }
```

---

## Jobs

### `GET /jobs`

List approved jobs with search, filtering, and pagination. **Public.**

**Query parameters:**

| Param | Type | Description |
|-------|------|-------------|
| `search` | string | Fulltext search against title & description (boolean mode) |
| `location` | string | Filter by location (partial match) |
| `category_id` | integer | Filter by category ID |
| `experience_level` | string | Filter: `entry`, `mid`, `senior`, `lead` |
| `salary_min` | integer | Filter: minimum salary range |
| `salary_max` | integer | Filter: maximum salary range |
| `posted_within` | string | Filter: `24h`, `week`, `month` |
| `sort` | string | `relevance` (default when searching) or `date` |
| `per_page` | integer | 10-20, default 10 |

**Response `200` (paginated):**
```json
{
  "success": true,
  "message": "Jobs retrieved successfully",
  "data": [
    {
      "id": 1,
      "title": "Senior Laravel Developer",
      "description": "...",
      "requirements": "...",
      "benefits": "...",
      "salary_min": 50000,
      "salary_max": 80000,
      "location": "Cairo",
      "work_type": "remote",
      "experience_level": "senior",
      "deadline": "2026-06-01",
      "status": "approved",
      "status_label": "Approved",
      "categories": [{ "id": 1, "name": "Programming" }],
      "skills": [{ "id": 1, "name": "PHP" }],
      "company_id": 1,
      "company": {
        "id": 1,
        "user": { "id": 2, "name": "Acme Corp", "email": "hr@acme.com", "linkedin_url": null },
        "name": "Acme Corp",
        "logo": null,
        "description": "A great company"
      }
    }
  ],
  "meta": {
    "current_page": 1,
    "last_page": 5,
    "per_page": 10,
    "total": 50,
    "from": 1,
    "to": 10
  }
}
```

### `GET /jobs/{job}`

Show a single job listing. Increments view counter. **Public.**

**Response `200`:**
```json
{
  "success": true,
  "message": "Job retrieved successfully",
  "data": { "...same shape as index item..." }
}
```

### `POST /jobs`

Create a new job listing. Requires `auth:sanctum` + employer role (policy).

**Request body:**
```json
{
  "title": "Senior Laravel Developer",
  "description": "We are looking for...",
  "requirements": "5+ years of PHP",
  "benefits": "Remote work, equity",
  "salary_min": 50000,
  "salary_max": 80000,
  "location": "Cairo",
  "work_type": "remote",
  "experience_level": "senior",
  "deadline": "2026-06-01",
  "categories": [1, 2],
  "skills": [1, 3, 5],
  "company_id": 1
}
```

**Validation rules:**
| Field | Rules |
|-------|-------|
| `title` | required, string, max:255 |
| `description` | required, string |
| `requirements` | nullable, string |
| `benefits` | nullable, string |
| `salary_min` | nullable, numeric |
| `salary_max` | nullable, numeric |
| `location` | required, string |
| `work_type` | required, in: `remote`, `onsite`, `hybrid` |
| `experience_level` | required, in: `entry`, `mid`, `senior`, `lead` |
| `deadline` | nullable, date, after_or_equal:today |
| `categories` | nullable, array of existing category IDs |
| `skills` | nullable, array of existing skill IDs |
| `company_id` | required, must exist |

> Note: `company_id` is overridden server-side to the employer's company.

**Response `201`:**
```json
{
  "success": true,
  "message": "Job created successfully",
  "data": { "...JobResource shape..." }
}
```

### `PATCH /jobs/{job}`

Update a job listing. Requires auth + owner or admin.

**Request body:** Same fields as store, all optional.

**Response `200`:**
```json
{
  "success": true,
  "message": "Job updated successfully",
  "data": { "...JobResource shape..." }
}
```

### `DELETE /jobs/{job}`

Delete a job listing. Requires auth + owner or admin.

**Response `200`:**
```json
{
  "success": true,
  "message": "Job deleted successfully"
}
```

### `GET /employer/jobs`

List the authenticated employer's own jobs. Requires `auth:sanctum`.

**Response `200`:**
```json
{
  "success": true,
  "message": "Jobs retrieved successfully",
  "data": [ "...array of JobResource..." ]
}
```

---

## Applications

### `POST /jobs/{job}/apply`

Submit an application for a job. Requires `auth:sanctum` + candidate role.

**Request (multipart/form-data):**
| Field | Rules |
|-------|-------|
| `resume` | required, file, mimes:pdf,doc,docx, max:5120 |
| `cover_letter` | nullable, string, max:3000 |

**Business rules:**
- Job must be approved.
- Cannot apply to your own job (as employer).
- Duplicate applications (same user + job) rejected.
- Application deadline must not have passed.

**Response `201`:**
```json
{
  "success": true,
  "message": "Application submitted successfully",
  "data": {
    "id": 1,
    "job": { "id": 1, "title": "Senior Dev", "company": { "id": 1, "name": "Acme" } },
    "cover_letter": "...",
    "resume_url": "https://r2.example.com/...",
    "status": "pending",
    "status_label": "Pending",
    "created_at": "2026-05-09 12:00:00",
    "rejection_reason": null,
    "user": { "id": 2, "name": "John Doe", "email": "john@test.com", "phone": "...", "linkedin_url": "..." }
  }
}
```

**Response `400` (job not approved or deadline passed):**
```json
{
  "success": false,
  "message": "This job is not open for applications."
}
```

**Response `403` (own job):**
```json
{
  "success": false,
  "message": "You cannot apply to your own job posting."
}
```

**Response `409` (duplicate):**
```json
{
  "success": false,
  "message": "You have already applied to this job."
}
```

### `GET /jobs/{job}/applications`

List applications for a specific job. Requires auth + job owner.

**Query params:** `?status=pending|accepted|rejected`

**Response `200` (paginated):** Array of ApplicationResource.

### `GET /applications`

List own applications — role-scoped:
- **Candidate:** own applications
- **Employer:** applications to own jobs

**Response `200` (paginated):** Array of ApplicationResource.

### `GET /applications/{application}`

Show a single application. Requires auth + owner of application or job.

**Response `200`:**
```json
{
  "success": true,
  "message": "Application details retrieved successfully",
  "data": { "...ApplicationResource shape..." }
}
```

### `PATCH /applications/{application}/status`

Update application status. Requires auth + employer (owner of the job).

**Business rules:** Only pending applications can have their status updated.

**Request body:**
```json
{
  "status": "accepted",
  "rejection_reason": "We found a better fit"
}
```

**Validation rules:**
| Field | Rules |
|-------|-------|
| `status` | required, in: `accepted`, `rejected` |
| `rejection_reason` | nullable, string, max:2000, prohibited unless `status=rejected` |

**Response `200`:**
```json
{
  "success": true,
  "message": "Application status updated successfully",
  "data": { "...ApplicationResource shape..." }
}
```

**Response `422` (not pending):**
```json
{
  "success": false,
  "message": "Only pending applications can be updated."
}
```

### `DELETE /applications/{application}`

Withdraw a pending application. Requires auth + candidate (owner).

**Business rules:** Only pending applications can be withdrawn.

**Response `204`:** No content.

**Response `422` (not pending):**
```json
{
  "success": false,
  "message": "Only pending applications can be withdrawn."
}
```

---

## Comments

### `GET /jobs/{job}/comments`

List comments for a job. Requires auth.

**Response `200` (paginated):**
```json
{
  "success": true,
  "message": "Comments retrieved successfully",
  "data": [
    {
      "id": 1,
      "job_id": 1,
      "user_id": 2,
      "content": "Great job posting!",
      "created_at": "2026-05-09T12:00:00.000000Z",
      "updated_at": "2026-05-09T12:00:00.000000Z",
      "deleted_at": null,
      "user": { "id": 2, "name": "John Doe" }
    }
  ],
  "meta": { "...pagination..." }
}
```

### `POST /jobs/{job}/comments`

Post a comment on a job. Requires auth.

**Request body:**
```json
{
  "content": "Great job posting! (max 2000 chars)"
}
```

**Response `201`:**
```json
{
  "success": true,
  "message": "Comment posted successfully",
  "data": { "...comment with user..." }
}
```

### `PUT /comments/{comment}`

Update own comment. Requires auth + owner.

**Response `200`:** Same shape.

### `DELETE /comments/{comment}`

Delete a comment. Requires auth + owner (admin can delete any).

**Response `204`:** No content.

---

## Categories & Skills

### `GET /categories`

List all categories. **Public.**

**Response `200`:**
```json
{
  "success": true,
  "message": "Categories retrieved successfully",
  "data": [
    { "id": 1, "name": "Programming" },
    { "id": 2, "name": "Design" }
  ]
}
```

### `GET /skills`

List all skills. **Public.**

**Response `200`:**
```json
{
  "success": true,
  "message": "Skills retrieved successfully",
  "data": [
    { "id": 1, "name": "PHP" },
    { "id": 2, "name": "Laravel" }
  ]
}
```

### `GET /skills/suggest?search=lar`

Suggest skills by name (max 10 results). **Public.**

**Response `200`:**
```json
{
  "success": true,
  "message": "Skills suggested successfully",
  "data": [
    { "id": 2, "name": "Laravel" }
  ]
}
```

> **Admin-only** endpoints for categories/skills CRUD are listed in the [Admin section](#admin).

---

## Notifications

All notification endpoints require `auth:sanctum`.

### `GET /notifications`

List the authenticated user's notifications. Requires auth.

**Query params:** `?unread=1` to filter unread only.

**Response `200`:**
```json
{
  "success": true,
  "message": "Notifications retrieved successfully",
  "data": {
    "notifications": {
      "data": [
        {
          "id": 1,
          "user_id": 1,
          "type": "job_approved",
          "message": "Your job posting \"Senior Dev\" has been approved and is now live.",
          "is_read": false,
          "created_at": "2026-05-09T12:00:00.000000Z",
          "updated_at": "2026-05-09T12:00:00.000000Z"
        }
      ],
      "current_page": 1,
      "last_page": 1,
      "per_page": 20,
      "total": 1
    },
    "unread_count": 3
  }
}
```

### `POST /notifications/read-all`

Mark all notifications as read.

**Response `200`:**
```json
{
  "success": true,
  "message": "All notifications marked as read"
}
```

### `PATCH /notifications/{notification}/read`

Mark a single notification as read.

**Response `200`:**
```json
{
  "success": true,
  "message": "Notification marked as read",
  "data": { "...notification..." }
}
```

### `DELETE /notifications/{notification}`

Delete a notification.

**Response `204`:** No content.

---

## Company

All company endpoints require `auth:sanctum` + `role:employer` + `verified`.

### `GET /company`

Show the employer's company profile.

**Response `200`:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "user_id": 2,
    "name": "Acme Corp",
    "description": "We build great software",
    "logo": "logos/abc123.jpg",
    "website": "https://acme.com",
    "location": "Cairo, Egypt",
    "created_at": "...",
    "updated_at": "..."
  }
}
```

**Response `404` (no company):**
```json
{
  "success": false,
  "message": "This profile has no companies"
}
```

### `POST /company`

Create or update company profile (upsert).

**Request (multipart/form-data):**
| Field | Rules |
|-------|-------|
| `name` | required, string, max:255 |
| `description` | nullable, string |
| `website` | nullable, url |
| `location` | nullable, string |
| `logo` | nullable, image, mimes:jpeg,png,jpg,gif, max:2048 |

**Response `200`:**
```json
{
  "success": true,
  "message": "Company profile saved successfully",
  "data": { "...company..." }
}
```

---

## Employer Analytics

Requires `auth:sanctum` + `role:employer`.

### `GET /employer/analytics`

Get analytics overview for the employer's company.

**Query params:** `?from=2026-01-01&to=2026-05-09`

**Response `200`:**
```json
{
  "success": true,
  "message": "Analytics retrieved successfully",
  "data": {
    "company": { "id": 1, "name": "Acme Corp" },
    "total_jobs": 5,
    "total_applications": 50,
    "applications_by_status": {
      "pending": 30,
      "accepted": 10,
      "rejected": 10
    },
    "top_jobs": [
      {
        "id": 1,
        "title": "Senior Dev",
        "status": "approved",
        "applications_count": 20,
        "views": 100,
        "conversion_rate": 0.2
      }
    ],
    "recent_applications": [ "...applications..." ]
  }
}
```

### `GET /employer/jobs/{job}/applications`

List applications for a specific owned job. Requires auth + job owner.

**Query params:** `?from=...&to=...`

**Response `200` (paginated):** Array of applications.

---

## Admin

All admin endpoints require `auth:sanctum` + `role:admin`. Prefix: `/api/admin`.

### Dashboard

#### `GET /admin/dashboard`

Platform overview metrics.

**Response `200`:**
```json
{
  "success": true,
  "message": "Dashboard data retrieved successfully",
  "data": {
    "users": { "total": 100, "candidates": 70, "employers": 25, "admins": 5 },
    "jobs": { "total": 50, "pending": 10, "approved": 35, "rejected": 5 },
    "applications": { "total": 200, "pending": 100, "accepted": 60, "rejected": 40 },
    "companies": 20,
    "comments": 300
  }
}
```

#### `GET /admin/dashboard/activity`

Recent activity feed.

**Response `200`:**
```json
{
  "success": true,
  "message": "Recent activity retrieved successfully",
  "data": {
    "recent_users": [ { "id": 1, "name": "...", "email": "...", "role": "candidate", "created_at": "..." } ],
    "recent_jobs": [ { "id": 1, "company_id": 1, "title": "...", "status": "pending", "created_at": "..." } ],
    "recent_applications": [ "...applications..." ]
  }
}
```

#### `GET /admin/activity-logs`

Platform activity logs.

**Query params:** `?action=user.suspend&user_id=1&per_page=20`

**Response `200` (paginated):**
```json
{
  "data": [
    {
      "id": 1,
      "user_id": 1,
      "action": "user.suspend",
      "subject_type": "App\\Models\\User",
      "subject_id": 2,
      "meta": { "email": "user@example.com" },
      "created_at": "...",
      "updated_at": "..."
    }
  ],
  "current_page": 1,
  "last_page": 1,
  "per_page": 20,
  "total": 1,
  "from": 1,
  "to": 1
}
```

### Job Moderation

#### `GET /admin/jobs?status=pending`

List jobs by status (default: pending). Paginated.

#### `PATCH /admin/jobs/{job}/approve`

Approve a pending job. Sends notification to employer.

**Business rules:** Only pending jobs can be approved.

**Response `200`:**
```json
{
  "success": true,
  "message": "Job approved successfully",
  "data": { "...job with company..." }
}
```

**Response `422` (not pending):**
```json
{
  "success": false,
  "message": "Only pending jobs can be approved. Current status: approved"
}
```

#### `PATCH /admin/jobs/{job}/reject`

Reject a pending job with a reason.

**Business rules:** Only pending jobs can be rejected.

**Request body:**
```json
{
  "reason": "Inappropriate content (max 1000 chars)"
}
```

**Response `200`:** Job data with notification sent.

**Response `422` (not pending):**
```json
{
  "success": false,
  "message": "Only pending jobs can be rejected. Current status: approved"
}
```

#### `POST /admin/jobs/bulk-approve`

Bulk approve multiple jobs.

**Request body:**
```json
{
  "ids": [1, 2, 3]
}
```

**Response `200`:**
```json
{
  "success": true,
  "message": "Bulk approve completed",
  "data": { "count": 3 }
}
```

#### `POST /admin/jobs/bulk-reject`

Bulk reject multiple jobs with a reason.

**Request body:**
```json
{
  "ids": [1, 2, 3],
  "reason": "Policy violation"
}
```

### Comment Moderation

#### `GET /admin/comments?job_id=1`

List all comments (optional job filter). Paginated.

#### `DELETE /admin/comments/{comment}`

Remove a comment (soft-delete). Logs moderation action.

**Request body:**
```json
{
  "reason": "Spam (optional)"
}
```

**Response `204`:** No content.

### Categories & Skills CRUD

#### `POST /admin/categories`

Create category.

**Request body:**
```json
{ "name": "Programming" }
```

#### `PATCH /admin/categories/{category}`

Update category.

#### `DELETE /admin/categories/{category}`

Delete category.

#### `POST /admin/skills`

Create skill.

**Request body:**
```json
{ "name": "PHP" }
```

#### `PATCH /admin/skills/{skill}`

Update skill.

#### `DELETE /admin/skills/{skill}`

Delete skill.

### User Management

#### `GET /admin/users?q=john&role=candidate`

List users with optional search and role filter. Paginated.

#### `PATCH /admin/users/{user}/suspend`

Suspend a user.

**Response `200`:**
```json
{
  "success": true,
  "message": "User suspended",
  "data": { "...user..." }
}
```

#### `PATCH /admin/users/{user}/activate`

Activate a previously suspended user.

**Response `200`:**
```json
{
  "success": true,
  "message": "User activated",
  "data": { "...user..." }
}
```

---

## Enums Reference

### UserRole
| Value | Label |
|-------|-------|
| `candidate` | Candidate |
| `employer` | Employer |
| `admin` | Admin |

### JobStatus
| Value | Label |
|-------|-------|
| `pending` | Pending |
| `approved` | Approved |
| `rejected` | Rejected |

### ApplicationStatus
| Value | Label |
|-------|-------|
| `pending` | Pending |
| `accepted` | Accepted |
| `rejected` | Rejected |

### ExperienceLevel
| Value | Label |
|-------|-------|
| `entry` | Entry Level |
| `mid` | Mid Level |
| `senior` | Senior Level |
| `lead` | Lead / Principal |

### WorkType
| Value | Label |
|-------|-------|
| `remote` | Remote |
| `onsite` | On-site |
| `hybrid` | Hybrid |

---

## Standard Response Format

### Success
```json
{
  "success": true,
  "message": "Human-readable message",
  "data": { ... }
}
```

### Paginated Success
```json
{
  "success": true,
  "message": "Data retrieved successfully",
  "data": [ ... ],
  "meta": {
    "current_page": 1,
    "last_page": 5,
    "per_page": 10,
    "total": 50,
    "from": 1,
    "to": 10
  }
}
```

### Validation Error `422`
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "email": ["The email field is required."]
  }
}
```

### Error `4xx` / `5xx`
```json
{
  "success": false,
  "message": "Description of the error"
}
```

### HTTP Status Codes Used
| Code | Meaning |
|------|---------|
| 200 | OK |
| 201 | Created |
| 204 | No Content (successful delete) |
| 400 | Bad Request |
| 401 | Unauthorized (missing/invalid token) |
| 403 | Forbidden (insufficient role/permissions) |
| 404 | Not Found |
| 422 | Validation Error / Business Rule Conflict |
| 500 | Server Error |

---

## Quick Reference: Middleware by Endpoint

| Middleware | Applies To |
|------------|------------|
| `auth:sanctum` | All protected endpoints |
| `verified` | Profile update/download, Company CRUD |
| `role:employer` | Employer Analytics, Company |
| `role:admin` | All `/admin/*` endpoints |

### Vue Example: Axios Instance

```js
import axios from 'axios'

const api = axios.create({
  baseURL: 'https://your-domain.com/api',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  }
})

// Attach token from localStorage
api.interceptors.request.use(config => {
  const token = localStorage.getItem('access_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
```
