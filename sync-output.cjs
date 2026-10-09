const fs = require('fs');
const path = require('path');

const rootDir = process.cwd();
const outputDir = path.join(rootDir, 'output');
const distDir = path.join(rootDir, 'dist');
const publicDir = path.join(rootDir, 'public');
const srcDir = path.join(rootDir, 'src');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

function copyRecursiveSync(src, dest) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();
  if (isDirectory) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    fs.readdirSync(src).forEach((childItemName) => {
      copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
    });
  } else if (exists) {
    fs.copyFileSync(src, dest);
  }
}

// 1. Clean stale bundles from output/assets if present
const outputAssetsDir = path.join(outputDir, 'assets');
if (fs.existsSync(outputAssetsDir)) {
  fs.readdirSync(outputAssetsDir).forEach((f) => {
    if (/^index-.*\.(js|css)(\.map)?$/.test(f)) {
      try { fs.unlinkSync(path.join(outputAssetsDir, f)); } catch (e) {}
    }
  });
}

// 2. Copy dist contents to output
if (fs.existsSync(distDir)) {
  copyRecursiveSync(distDir, outputDir);
}

// 3. Copy full developer source code into output (src, package.json, config files)
const outputSrcDir = path.join(outputDir, 'src');
if (fs.existsSync(srcDir)) {
  copyRecursiveSync(srcDir, outputSrcDir);
}

const sourceFilesToCopy = [
  'index.php',
  'data.json',
  'server.ts',
  'package.json',
  'tsconfig.json',
  'vite.config.ts',
  'index.html',
];

sourceFilesToCopy.forEach((file) => {
  const src = path.join(rootDir, file);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, path.join(outputDir, file));
  }
});

// Copy .htaccess if present
const htaccessSrc = path.join(publicDir, '.htaccess');
if (fs.existsSync(htaccessSrc)) {
  fs.copyFileSync(htaccessSrc, path.join(outputDir, '.htaccess'));
}

// 4. Ensure assets and uploads directories exist in output
copyRecursiveSync(path.join(publicDir, 'assets'), path.join(outputDir, 'assets'));
copyRecursiveSync(path.join(rootDir, 'assets'), path.join(outputDir, 'assets'));
copyRecursiveSync(path.join(publicDir, 'uploads'), path.join(outputDir, 'uploads'));
const uploadsDest = path.join(outputDir, 'uploads');
if (!fs.existsSync(uploadsDest)) {
  fs.mkdirSync(uploadsDest, { recursive: true });
}

// 5. Update output README.md with comprehensive documentation
const readmeContent = `# Omnintell Technologies & Omnintell Labs — Official Production Source

This repository in \`output/\` contains the complete, production-grade source code and compiled release of the **Omnintell Technologies** and **Omnintell Labs** portfolio for **Omkareshwar Sinha (Jack)**.

## Project Structure
- \`src/\`: Complete TypeScript + React 19 source code (Google Flow shaders, Framer Motion choreography, 3D Hero, Admin Studio).
- \`index.html\`: Web entry point with optimized metadata, Kanit typography, and SEO structured data.
- \`server.ts\`: Full-stack Express server with bcrypt security, token authentication, dynamic endpoints, and image upload pipeline.
- \`server.cjs\`: Bundled standalone production server for Node.js / Cloud Run / Docker.
- \`index.php\`: Standalone PHP version with session authentication, rate limiting, and data persistence for shared hosting / Apache / Nginx.
- \`data.json\`: Live portfolio and customizable theme configuration.
- \`assets/\`: Optimized CSS, JS chunks, and high-resolution assets.
- \`uploads/\`: Directory for project and certificate media files.

## Running the Application

### Option A: Node.js / TypeScript (Recommended)
\`\`\`bash
npm install
npm run dev     # Starts development server on port 3000
npm run build   # Builds production bundle and syncs to output/
npm start       # Runs production server (server.cjs)
\`\`\`

### Option B: Standalone PHP (Shared Hosting / Apache / cPanel)
1. Upload all contents of this \`output/\` folder to your \`public_html\` directory.
2. Ensure \`data.json\` and \`uploads/\` have write permissions (\`chmod 755\`).
3. Open in browser: \`https://yourdomain.com/index.php\`.

### Educational Context & Credentials
- **Founder & CEO**: Omkareshwar Sinha (Jack)
- **Brands**: Omnintell Technologies & Omnintell Labs
- **Educational Institution Context**: Mothers Pride School (MPS) Khamariya, Chhattisgarh, India
`;

fs.writeFileSync(path.join(outputDir, 'README.md'), readmeContent, 'utf8');

console.log('[sync-output] Successfully synced all production and source files to /output directory.');

// 6. Pre-generate zip packages in /output
try {
  const archiverMod = require('archiver');
  let archive;
  if (typeof archiverMod === 'function') {
    archive = archiverMod('zip', { zlib: { level: 1 } });
  } else if (archiverMod.ZipArchive) {
    archive = new archiverMod.ZipArchive({ zlib: { level: 1 } });
  } else if (archiverMod.default && typeof archiverMod.default === 'function') {
    archive = archiverMod.default('zip', { zlib: { level: 1 } });
  } else if (archiverMod.default && archiverMod.default.ZipArchive) {
    archive = new archiverMod.default.ZipArchive({ zlib: { level: 1 } });
  }

  if (archive) {
    const os = require('os');
    const tempZip = path.join(os.tmpdir(), 'om_sync_build.zip');
    const zipPath = path.join(outputDir, 'omnintell-source-code.zip');
    const zipPathAlt = path.join(outputDir, 'omnintell-technologies-portfolio.zip');
    const zipPathLegacy = path.join(outputDir, 'omnintell-portfolio.zip');
    const outputStream = fs.createWriteStream(tempZip);

    outputStream.on('close', () => {
      fs.copyFileSync(tempZip, zipPath);
      fs.copyFileSync(tempZip, zipPathAlt);
      fs.copyFileSync(tempZip, zipPathLegacy);
      try { fs.unlinkSync(tempZip); } catch (e) {}
      console.log(`[sync-output] Generated ${archive.pointer()} total bytes clean source package ZIP in /output.`);
      process.exit(0);
    });

    archive.on('error', (err) => {
      console.warn('[sync-output] Warning: could not finalize zip in sync script', err.message);
    });

    archive.pipe(outputStream);
    archive.glob('**/*', {
      cwd: outputDir,
      ignore: ['*.zip', 'failed_logins.json', 'inquiries.json', '.env*']
    });
    archive.finalize();
  }
} catch (e) {
  console.log('[sync-output] Archiver note:', e.message);
}
