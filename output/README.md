# Omnintell Technologies & Omnintell Labs — Official Production Source

This repository in `output/` contains the complete, production-grade source code and compiled release of the **Omnintell Technologies** and **Omnintell Labs** portfolio for **Omkareshwar Sinha (Jack)**.

## Project Structure
- `src/`: Complete TypeScript + React 19 source code (Google Flow shaders, Framer Motion choreography, 3D Hero, Admin Studio).
- `index.html`: Web entry point with optimized metadata, Kanit typography, and SEO structured data.
- `server.ts`: Full-stack Express server with bcrypt security, token authentication, dynamic endpoints, and image upload pipeline.
- `server.cjs`: Bundled standalone production server for Node.js / Cloud Run / Docker.
- `index.php`: Standalone PHP version with session authentication, rate limiting, and data persistence for shared hosting / Apache / Nginx.
- `data.json`: Live portfolio and customizable theme configuration.
- `assets/`: Optimized CSS, JS chunks, and high-resolution assets.
- `uploads/`: Directory for project and certificate media files.

## Running the Application

### Option A: Node.js / TypeScript (Recommended)
```bash
npm install
npm run dev     # Starts development server on port 3000
npm run build   # Builds production bundle and syncs to output/
npm start       # Runs production server (server.cjs)
```

### Option B: Standalone PHP (Shared Hosting / Apache / cPanel)
1. Upload all contents of this `output/` folder to your `public_html` directory.
2. Ensure `data.json` and `uploads/` have write permissions (`chmod 755`).
3. Open in browser: `https://yourdomain.com/index.php`.

### Educational Context & Credentials
- **Founder & CEO**: Omkareshwar Sinha (Jack)
- **Brands**: Omnintell Technologies & Omnintell Labs
- **Educational Institution Context**: Mothers Pride School (MPS) Khamariya, Chhattisgarh, India
