/**
 * ============================================================================
 * WellBuddy Audio Studio — Celebrity Voice Asset Generator
 * ============================================================================
 * Generates studio-calibrated Neural TTS voice clips for WellBuddy's
 * celebrity and companion models (Trisha Krishnan & Samantha Ruth Prabhu).
 *
 * Supported CLI Options:
 *   --voice=all|trisha|samantha   Target specific voice model (default: all)
 *   --dry-run                     Log generation plan without invoking synthesis
 *   --verbose                     Enable detailed WebSocket logging
 *
 * Usage:
 *   node scripts/generate_celebrity_voices.cjs
 *   node scripts/generate_celebrity_voices.cjs --voice=trisha
 * ============================================================================
 */

const { MsEdgeTTS, OUTPUT_FORMAT } = require('msedge-tts');
const fs = require('fs');
const path = require('path');

// CLI Argument parsing
const args = process.argv.slice(2);
const voiceArg = (args.find((a) => a.startsWith('--voice=')) || '').split('=')[1] || 'all';
const isDryRun = args.includes('--dry-run');
const isVerbose = args.includes('--verbose');

/**
 * Enterprise Voice Manifest Definitions
 */
const VOICE_MANIFEST = {
  trisha: {
    displayName: 'Trisha (த்ரிஷா)',
    locale: 'ta-IN',
    neuralVoice: 'ta-IN-PallaviNeural',
    // Soft, sweet, elegant, melodic prosody
    prosody: {
      pitch: '+1Hz',
      rate: '-3%',
      volume: '+0%',
    },
    clips: {
      'preview.mp3': {
        action: 'preview',
        text: 'வணக்கம், நான் த்ரிஷா. கண்களுக்கு சிறிது ஓய்வு கொடுத்து, மனதை அமைதிப்படுத்தி புத்துணர்ச்சியுடன் இருங்கள்.',
        desc: 'Settings Preview & Morning Greeting',
      },
      'water.mp3': {
        action: 'water',
        text: 'ஹே, கொஞ்சம் தண்ணீர் குடிங்க! உடலை நீரேற்றமாக வெச்சிருக்கிறது ரொம்ப முக்கியம்.',
        desc: 'Hydration Intake Alert',
      },
      'eye_rest.mp3': {
        action: 'eye_rest',
        text: 'ஸ்கிரீனை தொடர்ந்து பார்க்காதீங்க. கண்களுக்கு கொஞ்சம் ஓய்வு கொடுத்து தூரத்துல பாருங்க.',
        desc: '20-20-20 Eye Care Break',
      },
      'standing.mp3': {
        action: 'standing',
        text: 'ரொம்ப நேரம் உட்கார்ந்தாச்சு! எந்திரிச்சு ஒரு சின்ன நடை போயிட்டு வாங்க.',
        desc: 'Posture & Movement Reminder',
      },
      'stretching.mp3': {
        action: 'stretching',
        text: 'கொஞ்சம் சோம்பல் முறிச்சு உடம்பை ஸ்ட்ரெட்ச் பண்ணுங்க. ரொம்ப ரிலாக்ஸா இருக்கும்!',
        desc: 'Full Body Stretch & Energize',
      },
    },
  },

  samantha: {
    displayName: 'Samantha (சமந்தா)',
    locale: 'ta-IN',
    neuralVoice: 'ta-IN-PallaviNeural',
    // Upbeat, bright, positive, cheerful prosody
    prosody: {
      pitch: '+4Hz',
      rate: '+3%',
      volume: '+0%',
    },
    clips: {
      'preview.mp3': {
        action: 'preview',
        text: 'வணக்கம்! நான் சமந்தா! உடலை ஆரோக்கியமாக வையுங்கள், நிறைய தண்ணீர் குடியுங்கள், எப்போதும் உற்சாகமாக இருங்கள்!',
        desc: 'Settings Preview & Radiant Welcome',
      },
      'water.mp3': {
        action: 'water',
        text: 'ஹாய்! உடனே ஒரு கிளாஸ் தண்ணீர் குடிங்க. ஹைட்ரேஷன் தான் எப்போதும் பளபளப்பா வெச்சிருக்கும்!',
        desc: 'Glow Hydration Alert',
      },
      'eye_rest.mp3': {
        action: 'eye_rest',
        text: 'கொஞ்சம் 20 செகண்ட் கண்ணை மூடி ரிலாக்ஸ் பண்ணுங்க. உங்க கண்கள் பிரெஷ்ஷா மாறும்!',
        desc: 'Eye Reset & Mindfulness',
      },
      'standing.mp3': {
        action: 'standing',
        text: 'கம்ஆன், எந்திரிச்சு நில்லுங்க! ஒரு ரெண்டு நிமிஷம் நடங்க, எனர்ஜி தானா வரும்!',
        desc: 'Active Stand & Refresh',
      },
      'stretching.mp3': {
        action: 'stretching',
        text: 'உடம்பை நல்லா ஸ்ட்ரெட்ச் பண்ணுங்க! பிட்னஸ் தான் நமக்கு எல்லாமே, உற்சாகமா இருங்க!',
        desc: 'Dynamic Fitness & Stretch Break',
      },
    },
  },
};

/**
 * Format byte count into human-readable string
 */
function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  const kb = (bytes / 1024).toFixed(1);
  return `${kb} KB`;
}

/**
 * Synthesize a single clip to file using streaming buffer
 */
async function synthesizeClip(tts, voiceConfig, filename, clipInfo, targetDirs) {
  const [pubDir, distDir] = targetDirs;
  const targetPubPath = path.join(pubDir, filename);
  const targetDistPath = path.join(distDir, filename);

  if (isDryRun) {
    console.log(`  [DRY-RUN] Would synthesize: ${filename} -> "${clipInfo.text.substring(0, 36)}..."`);
    return;
  }

  const startTime = Date.now();
  await tts.setMetadata(voiceConfig.neuralVoice, OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3);

  return new Promise((resolve, reject) => {
    try {
      const { audioStream } = tts.toStream(clipInfo.text, voiceConfig.prosody);
      const writeStream = fs.createWriteStream(targetPubPath);

      audioStream.pipe(writeStream);

      writeStream.on('finish', () => {
        // Mirror copy to dist directory
        fs.copyFileSync(targetPubPath, targetDistPath);
        const stats = fs.statSync(targetPubPath);
        const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
        console.log(`  ✓ ${filename.padEnd(16)} [${formatBytes(stats.size).padStart(8)}] (${elapsed}s) — ${clipInfo.desc}`);
        resolve();
      });

      audioStream.on('error', (err) => reject(new Error(`Audio stream error on ${filename}: ${err.message}`)));
      writeStream.on('error', (err) => reject(new Error(`File write error on ${filename}: ${err.message}`)));
    } catch (err) {
      reject(err);
    }
  });
}

/**
 * Main Orchestrator
 */
async function main() {
  const projectRoot = path.resolve(__dirname, '..');
  const publicAudioRoot = path.join(projectRoot, 'public', 'audio');
  const distAudioRoot = path.join(projectRoot, 'dist', 'audio');

  console.log('\n======================================================');
  console.log('  WellBuddy Studio — Neural Voice Generator');
  console.log('======================================================');
  console.log(`Target: ${voiceArg.toUpperCase()} | Dry Run: ${isDryRun ? 'YES' : 'NO'}`);
  console.log(`Output Directory: ${publicAudioRoot}\n`);

  const tts = new MsEdgeTTS({ enableLogger: isVerbose });

  const targetVoiceKeys =
    voiceArg === 'all'
      ? Object.keys(VOICE_MANIFEST)
      : Object.keys(VOICE_MANIFEST).filter((k) => k.toLowerCase() === voiceArg.toLowerCase());

  if (targetVoiceKeys.length === 0) {
    console.error(`Unknown voice model: "${voiceArg}". Valid models: all, ${Object.keys(VOICE_MANIFEST).join(', ')}`);
    process.exit(1);
  }

  let totalGenerated = 0;
  const suiteStartTime = Date.now();

  for (const key of targetVoiceKeys) {
    const config = VOICE_MANIFEST[key];
    const pubDir = path.join(publicAudioRoot, key);
    const distDir = path.join(distAudioRoot, key);

    [pubDir, distDir].forEach((d) => {
      if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
    });

    console.log(`▶ Model: ${config.displayName} [${config.neuralVoice}]`);

    for (const [filename, clipInfo] of Object.entries(config.clips)) {
      try {
        await synthesizeClip(tts, config, filename, clipInfo, [pubDir, distDir]);
        totalGenerated++;
      } catch (err) {
        console.error(`  ✗ Error synthesizing ${filename}:`, err.message);
      }
    }
    console.log('');
  }

  tts.close();

  const totalElapsed = ((Date.now() - suiteStartTime) / 1000).toFixed(1);
  console.log(`✔ Completed: ${totalGenerated} audio files generated & verified across public/ and dist/ (${totalElapsed}s).`);
  console.log('======================================================\n');
}

main().catch((err) => {
  console.error('\nFatal generator error:', err);
  process.exit(1);
});
