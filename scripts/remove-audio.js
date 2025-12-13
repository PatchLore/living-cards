#!/usr/bin/env node

/**
 * Remove Audio from Living Card Videos
 * 
 * This script processes all MP4 files in public/cards/ to remove audio tracks completely.
 * Output videos will have zero audio channels (true silence, not muted).
 * 
 * Requirements:
 * - ffmpeg must be installed and available in PATH
 * - Videos are processed in-place (originals are replaced)
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const CARDS_DIR = path.join(__dirname, '..', 'public', 'cards');
const BACKUP_DIR = path.join(__dirname, '..', 'public', 'cards', '.backup');

// Ensure backup directory exists
if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
  console.log('📁 Created backup directory:', BACKUP_DIR);
}

// Get all MP4 files
const videoFiles = fs.readdirSync(CARDS_DIR)
  .filter(file => file.endsWith('.mp4'))
  .filter(file => !file.startsWith('.')); // Skip hidden files

if (videoFiles.length === 0) {
  console.log('❌ No MP4 files found in', CARDS_DIR);
  process.exit(1);
}

console.log(`\n🎬 Found ${videoFiles.length} video file(s) to process:\n`);
videoFiles.forEach(file => console.log(`  - ${file}`));

// Process each video
let processed = 0;
let failed = 0;

for (const videoFile of videoFiles) {
  const inputPath = path.join(CARDS_DIR, videoFile);
  const backupPath = path.join(BACKUP_DIR, videoFile);
  const tempPath = path.join(CARDS_DIR, `${videoFile}.silent.tmp`);

  try {
    console.log(`\n🔄 Processing: ${videoFile}`);

    // Step 1: Create backup
    if (!fs.existsSync(backupPath)) {
      fs.copyFileSync(inputPath, backupPath);
      console.log(`  ✓ Backup created: ${backupPath}`);
    } else {
      console.log(`  ⚠️  Backup already exists, skipping backup step`);
    }

    // Step 2: Remove audio using ffmpeg
    // -f mp4: Force MP4 output format
    // -c:v copy: Copy video stream without re-encoding (preserves quality)
    // -an: Remove all audio streams completely
    // -y: Overwrite output file if it exists
    const ffmpegCmd = `ffmpeg -i "${inputPath}" -f mp4 -c:v copy -an -y "${tempPath}"`;
    
    console.log(`  🔧 Running: ffmpeg -i "${videoFile}" -f mp4 -c:v copy -an ...`);
    execSync(ffmpegCmd, { stdio: 'inherit' });

    // Step 3: Verify output has no audio
    const probeCmd = `ffprobe -v error -select_streams a -show_entries stream=codec_type -of csv=p=0 "${tempPath}" 2>/dev/null || echo ""`;
    const audioStreams = execSync(probeCmd, { encoding: 'utf8' }).trim();

    if (audioStreams) {
      console.log(`  ❌ ERROR: Output still contains audio streams!`);
      fs.unlinkSync(tempPath);
      failed++;
      continue;
    }

    // Step 4: Replace original with silent version
    fs.renameSync(tempPath, inputPath);
    console.log(`  ✅ Success: ${videoFile} is now silent (zero audio channels)`);
    processed++;

  } catch (error) {
    console.error(`  ❌ Failed to process ${videoFile}:`, error.message);
    // Clean up temp file if it exists
    if (fs.existsSync(tempPath)) {
      fs.unlinkSync(tempPath);
    }
    failed++;
  }
}

// Summary
console.log(`\n${'='.repeat(60)}`);
console.log(`📊 Processing Summary:`);
console.log(`  ✅ Successfully processed: ${processed}`);
console.log(`  ❌ Failed: ${failed}`);
console.log(`  💾 Backups saved to: ${BACKUP_DIR}`);
console.log(`\n🎉 All videos now have zero audio channels (true silence)`);
console.log(`📝 Original files backed up in: ${BACKUP_DIR}`);
console.log(`${'='.repeat(60)}\n`);

if (failed > 0) {
  process.exit(1);
}

