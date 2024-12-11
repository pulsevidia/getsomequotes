function shuffleArrayRandomly(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function extractFirstLine(markdown) {
  const start = markdown.indexOf("##");
  if (start == -1) return null;
  const end = markdown.indexOf("\n", start);
  if (end === -1) return null;
  const what = [markdown.slice(start + 2, end).trim()];
  return what;
}
export { extractFirstLine, shuffleArrayRandomly };
