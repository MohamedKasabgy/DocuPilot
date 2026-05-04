export function chunkText(text: string, chunkSize: number = 900, overlap: number = 150) {
  const clean = text.replace(/\s+/g, " ").trim();
  const chunks: string[] = [];

  let start = 0;

  while (start < clean.length) {
    const end = Math.min(start + chunkSize, clean.length);
    chunks.push(clean.slice(start, end));
    start += chunkSize - overlap;
  }

  return chunks.filter((chunk) => chunk.length > 50);
}
