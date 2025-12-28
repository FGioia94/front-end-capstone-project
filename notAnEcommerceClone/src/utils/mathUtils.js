// Remaps a number from one range to another
export const remap = (value, inMin, inMax, outMin, outMax) => {
  return outMin + ((value - inMin) * (outMax - outMin)) / (inMax - inMin);
};

// http://github.com/cprosche/mulberry32 this is a simple PRNG generator, used to retrieve random values from int key for each card
export const mulberry32 = (seed) => {
  let t = seed + 0x6d2b79f5;
  return function () {
    t |= 0;
    t = (t ^ (t >>> 15)) * (t | 1);
    t ^= t + (t ^ (t >>> 7)) * (t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

