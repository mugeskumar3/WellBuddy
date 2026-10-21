const { MsEdgeTTS, OUTPUT_FORMAT } = require('msedge-tts');
const fs = require('fs');
const path = require('path');

async function generateClip(tts, text, voice, prosody, outputPath) {
  await tts.setMetadata(voice, OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3);
  return new Promise((resolve, reject) => {
    const { audioStream } = tts.toStream(text, prosody);
    const writeStream = fs.createWriteStream(outputPath);
    audioStream.pipe(writeStream);
    writeStream.on('finish', () => {
      console.log(`Generated: ${outputPath} (${fs.statSync(outputPath).size} bytes)`);
      resolve();
    });
    audioStream.on('error', reject);
    writeStream.on('error', reject);
  });
}

async function main() {
  const tts = new MsEdgeTTS({ enableLogger: false });

  const projectRoot = path.resolve(__dirname, '..');
  const trishaDir = path.join(projectRoot, 'public', 'audio', 'trisha');
  const samanthaDir = path.join(projectRoot, 'public', 'audio', 'samantha');
  const distTrishaDir = path.join(projectRoot, 'dist', 'audio', 'trisha');
  const distSamanthaDir = path.join(projectRoot, 'dist', 'audio', 'samantha');

  [trishaDir, samanthaDir, distTrishaDir, distSamanthaDir].forEach(d => {
    if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
  });

  // Trisha clips - Soft, sweet, elegant cadence
  const trishaProsody = { pitch: "+1Hz", rate: "-3%" };
  const trishaClips = {
    'preview.mp3': 'வணக்கம், நான் த்ரிஷா. கண்களுக்கு சிறிது ஓய்வு கொடுத்து, மனதை அமைதிப்படுத்தி புத்துணர்ச்சியுடன் இருங்கள்.',
    'water.mp3': 'ஹே, கொஞ்சம் தண்ணீர் குடிங்க! உடலை நீரேற்றமாக வெச்சிருக்கிறது ரொம்ப முக்கியம்.',
    'eye_rest.mp3': 'ஸ்கிரீனை தொடர்ந்து பார்க்காதீங்க. கண்களுக்கு கொஞ்சம் ஓய்வு கொடுத்து தூரத்துல பாருங்க.',
    'standing.mp3': 'ரொம்ப நேரம் உட்கார்ந்தாச்சு! எந்திரிச்சு ஒரு சின்ன நடை போயிட்டு வாங்க.',
    'stretching.mp3': 'கொஞ்சம் சோம்பல் முறிச்சு உடம்பை ஸ்ட்ரெட்ச் பண்ணுங்க. ரொம்ப ரிலாக்ஸா இருக்கும்!'
  };

  console.log("--- Generating Trisha Voice Clips ---");
  for (const [filename, text] of Object.entries(trishaClips)) {
    const pubFile = path.join(trishaDir, filename);
    await generateClip(tts, text, 'ta-IN-PallaviNeural', trishaProsody, pubFile);
    fs.copyFileSync(pubFile, path.join(distTrishaDir, filename));
  }

  // Samantha clips - Energetic, bright, cheerful cadence
  const samanthaProsody = { pitch: "+4Hz", rate: "+3%" };
  const samanthaClips = {
    'preview.mp3': 'வணக்கம்! நான் சமந்தா! உடலை ஆரோக்கியமாக வையுங்கள், நிறைய தண்ணீர் குடியுங்கள், எப்போதும் உற்சாகமாக இருங்கள்!',
    'water.mp3': 'ஹாய்! உடனே ஒரு கிளாஸ் தண்ணீர் குடிங்க. ஹைட்ரேஷன் தான் எப்போதும் பளபளப்பா வெச்சிருக்கும்!',
    'eye_rest.mp3': 'கொஞ்சம் 20 செகண்ட் கண்ணை மூடி ரிலாக்ஸ் பண்ணுங்க. உங்க கண்கள் பிரெஷ்ஷா மாறும்!',
    'standing.mp3': 'கம்ஆன், எந்திரிச்சு நில்லுங்க! ஒரு ரெண்டு நிமிஷம் நடங்க, எனர்ஜி தானா வரும்!',
    'stretching.mp3': 'உடம்பை நல்லா ஸ்ட்ரெட்ச் பண்ணுங்க! பிட்னஸ் தான் நமக்கு எல்லாமே, உற்சாகமா இருங்க!'
  };

  console.log("--- Generating Samantha Voice Clips ---");
  for (const [filename, text] of Object.entries(samanthaClips)) {
    const pubFile = path.join(samanthaDir, filename);
    await generateClip(tts, text, 'ta-IN-PallaviNeural', samanthaProsody, pubFile);
    fs.copyFileSync(pubFile, path.join(distSamanthaDir, filename));
  }

  tts.close();
  console.log("--- All Trisha and Samantha audio files generated successfully! ---");
}

main().catch(err => {
  console.error("Generation error:", err);
  process.exit(1);
});
