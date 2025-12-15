# Railway Backend Troubleshooting Guide

## Common Issues and Solutions

### 404 Errors for `/auth/login` and `/auth/me`

**Problem:** Getting 404 errors for routes like `/auth/login` and `/auth/me`

**Solution:** All API routes require the `/api` prefix. The correct URLs are:
- ✅ `/api/auth/login` (not `/auth/login`)
- ✅ `/api/auth/me` (not `/auth/me`)
- ✅ `/api/auth/register`
- ✅ `/api/users`
- ✅ `/api/rides`
- etc.

**Why:** The backend uses `app.setGlobalPrefix('api')` in `main.ts`, which prefixes all routes with `/api`.

### Frontend Configuration

Make sure your frontend's `NEXT_PUBLIC_API_URL` environment variable includes the `/api` path:

```env
NEXT_PUBLIC_API_URL=https://your-backend.railway.app/api
```

**Important:** The URL must end with `/api`, not just the domain.

### Health Check Endpoint

A health check endpoint is available at `/health` (without the `/api` prefix) for Railway monitoring:
- URL: `https://your-backend.railway.app/health`
- Response: `{ "status": "ok", "timestamp": "..." }`

### Verifying Routes

To verify all registered routes, check the Railway logs when the app starts. You should see:
```
[RouterExplorer] Mapped {/api/auth/login, POST} route
[RouterExplorer] Mapped {/api/auth/me, GET} route
```

### Database Connection Issues

If you see `ECONNREFUSED` errors:
1. Ensure PostgreSQL service is added in Railway
2. Link the database to your backend service
3. Verify `DATABASE_URL` is set in environment variables
4. Check that the database service is running

### Environment Variables Checklist

Required environment variables in Railway:
- `DATABASE_URL` - PostgreSQL connection string (auto-provided when linked)
- `JWT_SECRET` - Your JWT secret key
- `JWT_EXPIRES_IN` - Token expiration (e.g., `7d`)
- `NODE_ENV` - Set to `production`
- `FRONTEND_URL` - Your frontend URL (e.g., `https://your-frontend.netlify.app`)
- `PORT` - Automatically set by Railway (don't override)

### Testing the API

Test your API endpoints:
```bash
# Health check
curl https://your-backend.railway.app/health

# Login (correct URL with /api prefix)
curl -X POST https://your-backend.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### Common Mistakes

1. ❌ Calling `/auth/login` instead of `/api/auth/login`
2. ❌ Setting `NEXT_PUBLIC_API_URL` to `https://backend.railway.app` (missing `/api`)
3. ✅ Correct: `NEXT_PUBLIC_API_URL=https://backend.railway.app/api`
