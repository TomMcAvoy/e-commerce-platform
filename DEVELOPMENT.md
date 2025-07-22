# E-Commerce Platform Development Guide

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- MongoDB
- Redis (optional, for caching)
- npm or yarn

### Installation & Setup

1. **Clone and Install Dependencies**
   ```bash
   git clone <repository>
   cd shoppingcart
   npm install
   cd frontend && npm install && cd ..
   ```

2. **Environment Configuration**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Start Development Servers**
   ```bash
   # Start both backend and frontend
   npm run dev:all
   
   # Or start individually
   npm run dev:server    # Backend on :3000
   npm run dev:frontend  # Frontend on :3001
   ```

## 🧪 Testing

### Available Test Commands

| Command | Description |
|---------|-------------|
| `npm test` | Run comprehensive test suite |
| `npm run test:api` | Test API endpoints only |
| `npm run test:enhanced` | Run enhanced test suite |
| `npm run test:e2e` | Run end-to-end tests |

### Server Management Commands

| Command | Description |
|---------|-------------|
| `npm run dev:all` | Start both backend and frontend |
| `npm run dev:server` | Start backend only (port 3000) |
| `npm run dev:frontend` | Start frontend only (port 3001) |
| `npm run stop` | Gracefully stop all development servers |
| `npm run kill` | Force kill all development servers |

### Manual Testing

1. **Debug Pages**
   - Static Debug: http://localhost:3001/debug-api.html
   - Next.js Debug: http://localhost:3001/debug
   - API Health: http://localhost:3000/health
   - API Status: http://localhost:3000/api/status

2. **Browser Testing**
   - Open debug pages in browser
   - Check console for errors (F12)
   - Test API endpoints with buttons
   - Verify CORS headers

## 📊 Project Structure

```
shoppingcart/
├── src/                    # Backend TypeScript source
│   ├── controllers/        # API controllers
│   ├── middleware/         # Express middleware
│   ├── models/            # Mongoose models
│   ├── routes/            # API routes
│   ├── services/          # Business logic
│   ├── types/             # TypeScript types
│   └── utils/             # Utilities
├── frontend/              # Next.js frontend
│   ├── app/               # App router pages
│   ├── components/        # React components
│   ├── lib/              # Frontend utilities
│   └── public/           # Static assets
├── tests/                # Test files
├── test-results/         # Test output
└── uploads/             # File uploads
```

## 🔧 Development Workflow

### Making Changes

1. **Backend Changes**
   - Edit files in `src/`
   - Server auto-restarts with nodemon
   - Test with debug pages

2. **Frontend Changes** 
   - Edit files in `frontend/`
   - Hot reload enabled
   - Check browser console

3. **Database Changes**
   - Update models in `src/models/`
   - Run seed script: `npm run seed`

### Common Development Tasks

#### Adding New API Endpoint
1. Create route in `src/routes/`
2. Add controller in `src/controllers/`
3. Update types in `src/types/`
4. Test with debug pages

#### Adding New Frontend Page
1. Create page in `frontend/app/`
2. Add to navigation if needed
3. Update types for API calls

#### Adding Tests
1. Update `test-api.sh` for API tests
2. Add to `enhanced-test-suite.sh`
3. Create E2E tests in `tests/e2e/`

## 🐛 Troubleshooting

### Common Issues

| Issue | Solution |
|-------|----------|
| Port 3000/3001 in use | Kill process: `lsof -ti:3000 \| xargs kill -9` |
| MongoDB connection error | Start MongoDB: `brew services start mongodb-community` |
| CORS errors | Check `.env` CORS_ORIGIN setting |
| Module not found | Run `npm install` in root and frontend |

### Debug Tools

1. **Check Services**
   ```bash
   curl http://localhost:3000/health
   curl http://localhost:3001
   ```

2. **View Logs**
   - Backend: Check terminal running `npm run dev:server`
   - Frontend: Check terminal running `npm run dev:frontend`
   - Tests: Check `test-results/` directory

3. **Browser DevTools**
   - Network tab for API calls
   - Console for JavaScript errors
   - Application tab for localStorage/cookies

## 🌟 Best Practices

### Code Style
- Use TypeScript strict mode
- Follow ESLint configuration
- Use Prettier for formatting
- Write descriptive commit messages

### Testing
- Test API endpoints after changes
- Use debug pages for manual testing
- Run comprehensive tests before commits
- Check browser console for errors

### Security
- Never commit `.env` files
- Use environment variables for secrets
- Validate all inputs
- Use HTTPS in production

## 📚 Additional Resources

- [API Documentation](http://localhost:3000/api/status)
- [Test Results](./test-results/)
- [Debug Tools](http://localhost:3001/debug)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Next.js Documentation](https://nextjs.org/docs)

## 🚢 Deployment

### Build for Production
```bash
npm run build
cd frontend && npm run build
```

### Environment Variables
Set these in production:
- `NODE_ENV=production`
- `MONGODB_URI` (production database)
- `JWT_SECRET` (strong secret)
- `FRONTEND_URL` (production frontend URL)

### Deployment Options
- Docker containers
- Vercel (frontend)
- Railway/Heroku (backend)
- AWS/Google Cloud

---

## 📞 Support

For issues or questions:
1. Check troubleshooting section
2. Run debug tests
3. Check logs in `test-results/`
4. Create GitHub issue with details
