import confetti from "canvas-confetti";
import type { CommonWpmOptions } from "../types";
import { BrowserQRCodeReader } from "@zxing/browser";

export const duar = () => {
  const count = 200;
  const defaults = {
    origin: { y: 0.7 },
  };

  function fire(particleRatio: number, opts: confetti.Options) {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio),
    });
  }

  fire(0.25, {
    spread: 26,
    startVelocity: 55,
  });
  fire(0.2, {
    spread: 60,
  });
  fire(0.35, {
    spread: 100,
    decay: 0.91,
    scalar: 0.8,
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    scalar: 1.2,
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 45,
  });
};

export const split = (text: string, count: number) => {
  let subs = 0;
  let tagOpen = false;
  return text.split("").reduce<string[]>((acc, char, i) => {
    if ((i - subs) % count === 0 && !tagOpen) acc.push(char);
    else acc[acc.length - 1] += char;

    if (char === "<") tagOpen = true;
    else if (text[i - 1] === ">") tagOpen = false;
    if (tagOpen) subs++;

    return acc;
  }, []);
};

/**
 * Get second by Words per Minute
 * @param word
 * @param speed
 * @returns number (microseconds)
 */
export const wpm = (
  word: string | number,
  { speed, buffer }: CommonWpmOptions = { speed: 150, buffer: 1.5e3 }
) => {
  const wordCount =
    typeof word == "number" ? word : (word || "").split(" ").length;
  return (wordCount / speed) * 60 * 1e3 + buffer;
};

export const scanByStream = (stream: MediaStream, el?: HTMLVideoElement) => {
  const reader = new BrowserQRCodeReader();
  return reader.decodeOnceFromStream(stream, el);
};

export const scanByFile = (file: File) => {
  const reader = new BrowserQRCodeReader();
  const url = URL.createObjectURL(file);
  return reader.decodeFromImageUrl(url);
};

const common = { wpm, split, duar, scanByStream, scanByFile } as const;

export default common;
