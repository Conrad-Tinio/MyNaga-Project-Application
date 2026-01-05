# Deployment Guide for MedMap Naga to Netlify

## Prerequisites
- Git installed on your computer
- GitHub account
- Netlify account (free tier works fine)

## Step 1: Initialize Git Repository (if not already done)

1. Open your terminal/command prompt in the project directory
2. Check if Git is initialized:
   ```bash
   git status
   ```

3. If not initialized, run:
   ```bash
   git init
   ```

## Step 2: Create a .gitignore file (if not exists)

The `.gitignore` file should already exist and include:
- `node_modules/`
- `dist/`
- `.env` files
- Other build artifacts

## Step 3: Add and Commit Your Changes

1. Add all files to Git:
   ```bash
   git add .
   ```

2. Commit your changes:
   ```bash
   git commit -m "Initial commit: MedMap Naga prototype"
   ```

## Step 4: Create a GitHub Repository

1. Go to [GitHub](https://github.com) and sign in
2. Click the "+" icon in the top right → "New repository"
3. Name it (e.g., `mynaga-medmap`)
4. **DO NOT** initialize with README, .gitignore, or license (we already have these)
5. Click "Create repository"

## Step 5: Push to GitHub

1. GitHub will show you commands. Use these (replace YOUR_USERNAME and REPO_NAME):
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git
   git branch -M main
   git push -u origin main
   ```

   Or if you prefer SSH:
   ```bash
   git remote add origin git@github.com:YOUR_USERNAME/REPO_NAME.git
   git branch -M main
   git push -u origin main
   ```

## Step 6: Deploy to Netlify

### Option A: Deploy via Netlify Dashboard (Recommended)

1. Go to [Netlify](https://www.netlify.com) and sign in (or create account)
2. Click "Add new site" → "Import an existing project"
3. Choose "GitHub" as your Git provider
4. Authorize Netlify to access your GitHub account
5. Select your repository (`mynaga-medmap` or whatever you named it)
6. Configure build settings:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
   - **Node version:** (Netlify will auto-detect, but you can set it to 18.x or 20.x)
7. Click "Deploy site"

### Option B: Deploy via Netlify CLI

1. Install Netlify CLI globally:
   ```bash
   npm install -g netlify-cli
   ```

2. Login to Netlify:
   ```bash
   netlify login
   ```

3. Initialize Netlify in your project:
   ```bash
   netlify init
   ```
   - Choose "Create & configure a new site"
   - Follow the prompts

4. Deploy:
   ```bash
   netlify deploy --prod
   ```

## Step 7: Configure Environment (if needed)

If you need environment variables later:
1. Go to Netlify Dashboard → Your Site → Site settings → Environment variables
2. Add any required variables

## Step 8: Custom Domain (Optional)

1. Go to Site settings → Domain management
2. Add your custom domain
3. Follow DNS configuration instructions

## Important Notes

- The `netlify.toml` file is already configured for Vite projects
- The build command automatically runs `npm run build`
- The publish directory is set to `dist` (Vite's output folder)
- SPA routing is handled with redirects (all routes go to index.html)

## Troubleshooting

### Build Fails
- Check Node version in Netlify (should be 18.x or 20.x)
- Ensure all dependencies are in `package.json`
- Check build logs in Netlify dashboard

### Routing Issues
- The `netlify.toml` file includes redirects for SPA routing
- All routes should redirect to `index.html`

### Environment Variables
- Add any API keys or secrets in Netlify dashboard
- Access via `import.meta.env.VITE_YOUR_VAR` in Vite

## Continuous Deployment

Once connected, Netlify will automatically:
- Deploy when you push to `main` branch
- Create preview deployments for pull requests
- Show build status in GitHub

## Next Steps After Deployment

1. Test all features on the live site
2. Share the Netlify URL with your team
3. Monitor build logs for any issues
4. Set up custom domain if needed

