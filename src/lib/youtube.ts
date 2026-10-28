/** "https://youtu.be/abc" o "https://www.youtube.com/watch?v=abc" → "abc". */
export function idYoutube(url = "") {
  const m = url.match(/(?:youtu\.be\/|v=|embed\/|shorts\/|live\/)([\w-]{11})/);
  return m?.[1] ?? null;
}

export const miniaturaYoutube = (id: string) => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
