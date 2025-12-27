// Highscore management
export const saveHighscore = (username, score) => {
  if (!username) return;
  const key = `highscore_${username}`;
  const currentHighscore = localStorage.getItem(key);
  const current = currentHighscore ? parseInt(currentHighscore) : 0;
  
  if (score > current) {
    localStorage.setItem(key, score.toString());
    return true; // new highscore
  }
  return false;
};

export const getHighscore = (username) => {
  if (!username) return 0;
  const key = `highscore_${username}`;
  const stored = localStorage.getItem(key);
  return stored ? parseInt(stored) : 0;
};

export const getAllHighscores = () => {
  const scores = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith("highscore_")) {
      const username = key.replace("highscore_", "");
      const score = parseInt(localStorage.getItem(key));
      scores.push({ username, score });
    }
  }
  return scores.sort((a, b) => b.score - a.score);
};
