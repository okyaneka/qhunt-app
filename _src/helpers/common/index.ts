import confetti from "canvas-confetti";
import type { CommonWpmOptions } from "../types";
import dayjs, { type ConfigType } from "dayjs";
import { useEnv } from "~/_src/configs/env";

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

/**
 *
 * @param values Record<string, any>
 * @param prefix string
 * @returns Recored<string, string | number | boolean | null | undefined>
 */
export const flattenValues = (
  values: Record<string, any>,
  prefix: string = ""
) =>
  Object.entries(values).reduce<
    Record<string, string | number | boolean | null | undefined>
  >((acc, [key, value]) => {
    const newKey = prefix ? `${prefix}.${key}` : key;

    if (Array.isArray(value)) {
      Object.assign(
        acc,
        ...value.map((item, index) => {
          return typeof item === "object" && item !== null
            ? flattenValues(item, `${newKey}.${index}`)
            : { [`${newKey}.${index}`]: item };
        })
      );
    } else if (typeof value === "object" && value !== null) {
      Object.assign(acc, flattenValues(value, newKey));
    } else {
      acc[newKey] = value;
    }

    return acc;
  }, {});

/**
 * Get flatten keys from (any) object
 * @param values Record<string, any>
 * @param prefix string
 * @returns Keys string[]
 */
export const flattenKeys = (values: Record<string, any>, prefix: string = "") =>
  Object.keys(flattenValues(values));

export const formatDate = (
  rawDate: ConfigType,
  format: string = "DD/MM/YYYY"
) => dayjs(rawDate).format(format);

export const setTitle = (title?: string) => {
  const env = useEnv();

  return useSeoMeta({
    title: `${title ? title + " - " : ""} ${env.public.APP_NAME}`.trim(),
  });
};

const common = { wpm, split, duar, flattenValues, flattenKeys } as const;

export default common;
