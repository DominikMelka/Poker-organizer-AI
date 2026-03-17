// Module-level singleton — persists for the entire page lifetime
let audioElement: HTMLAudioElement | null = null;

function createBeepAudio(): HTMLAudioElement {
    const sampleRate = 44100;
    const duration = 2.1;
    const frequency = 880;
    const numSamples = Math.floor(sampleRate * duration);
    const buffer = new ArrayBuffer(44 + numSamples * 2);
    const view = new DataView(buffer);

    const writeStr = (offset: number, str: string) => {
        for (let i = 0; i < str.length; i++) view.setUint8(offset + i, str.charCodeAt(i));
    };
    writeStr(0, "RIFF");
    view.setUint32(4, 36 + numSamples * 2, true);
    writeStr(8, "WAVE");
    writeStr(12, "fmt ");
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, 1, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 2, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);
    writeStr(36, "data");
    view.setUint32(40, numSamples * 2, true);

    for (let i = 0; i < numSamples; i++) {
        const t = i / sampleRate;
        // 3 beeps: 0–0.35s, 0.6–0.95s, 1.2–2.0s
        const inBeep =
            (t >= 0 && t < 0.35) || (t >= 0.6 && t < 0.95) || (t >= 1.2 && t < 2.0);
        const sample = inBeep ? Math.sin(2 * Math.PI * frequency * t) * 0.7 * 32767 : 0;
        view.setInt16(44 + i * 2, sample, true);
    }

    const blob = new Blob([buffer], { type: "audio/wav" });
    const url = URL.createObjectURL(blob);
    const audio = new Audio(url);
    audio.load();
    return audio;
}

/** Call during a user gesture (e.g. Start button click) to unlock the audio element. */
export function unlockAudio() {
    if (typeof window === "undefined") return;
    if (!audioElement) audioElement = createBeepAudio();
    audioElement
        .play()
        .then(() => {
            audioElement!.pause();
            audioElement!.currentTime = 0;
        })
        .catch(() => { });
}

/** Play the 3-pulse beep. Works without user gesture after unlockAudio() was called once. */
export function playBeep() {
    if (typeof window === "undefined") return;
    if (!audioElement) audioElement = createBeepAudio();
    audioElement.currentTime = 0;
    audioElement.play().catch(console.error);
}
