# Cyber Hackathon - Vercel Deployment

This is a production-ready full-stack React application with integrated API routes, optimized for Vercel deployment.

## Tech Stack

- **Frontend**: React 18 + React Router 6 + TypeScript + Vite + TailwindCSS 3
- **Backend**: Vercel Serverless Functions
- **UI**: Radix UI + TailwindCSS 3 + Lucide React icons
- **Package Manager**: PNPM

## Local Development

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Type checking
pnpm typecheck

# Run tests
pnpm test
```

## Vercel Deployment

### Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **Vercel CLI** (optional): `npm i -g vercel`

### Deployment Steps

#### Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Push to GitHub**: Ensure your code is pushed to a GitHub repository

2. **Connect to Vercel**:
   - Go to [vercel.com/dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will automatically detect the configuration

3. **Configure Build Settings**:
   - **Framework Preset**: Vite
   - **Build Command**: `pnpm build`
   - **Output Directory**: `dist/spa`
   - **Install Command**: `pnpm install`

4. **Environment Variables** (if needed):
   - Go to Project Settings → Environment Variables
   - Add any required environment variables (e.g., `PING_MESSAGE`)

5. **Deploy**: Click "Deploy" and wait for the build to complete

#### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   vercel
   ```

4. **Follow the prompts**:
   - Link to existing project or create new
   - Confirm build settings
   - Deploy

### API Routes

The application includes the following API routes:

- `GET /api/ping` - Health check endpoint
- `GET /api/demo` - Demo endpoint

These are automatically deployed as Vercel serverless functions.

### Environment Variables

If you need to set environment variables:

1. **Local Development**: Create a `.env` file in the root directory
2. **Vercel Production**: Set them in the Vercel dashboard under Project Settings → Environment Variables

Example environment variables:
```
PING_MESSAGE=Hello from Vercel!
```

### Custom Domain (Optional)

1. Go to Project Settings → Domains
2. Add your custom domain
3. Follow the DNS configuration instructions

### Monitoring & Analytics

- **Vercel Analytics**: Enable in Project Settings
- **Function Logs**: View in Vercel Dashboard → Functions
- **Performance**: Monitor in Vercel Dashboard → Analytics

## Project Structure

```
├── api/                    # Vercel serverless functions
│   ├── ping.ts            # Health check endpoint
│   └── demo.ts            # Demo endpoint
├── client/                # React frontend
│   ├── pages/             # Route components
│   ├── components/        # UI components
│   └── App.tsx           # Main app component
├── shared/               # Shared types
├── vercel.json          # Vercel configuration
└── package.json         # Dependencies and scripts
```

## Troubleshooting

### Common Issues

1. **Build Fails**: Check that all dependencies are in `package.json`
2. **API Routes Not Working**: Ensure files are in the `api/` directory
3. **Environment Variables**: Verify they're set in Vercel dashboard
4. **CORS Issues**: Vercel handles CORS automatically for API routes

### Support

- [Vercel Documentation](https://vercel.com/docs)
- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)
