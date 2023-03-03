/**
 * Parses chapters from summary
 * @param summary - summary to parse chapters from
 * @returns chapters in format "timestamp - title"
 */
export function parseChaptersFromSummary(summary: string) {
  var chapters = "";
  // iterate through lines and extract chapters
  for (const line of summary.split("\n")) {
    // check if line is a chapter
    if (line.startsWith("#")) {
      // extract timestamp and title
      const matches = line.match(/# \[(.*?)\]\(.*?\) (.*)/);
      if (matches) {
        chapters += `${matches[1]} - ${matches[2]}`;
        chapters += "\n";
      }
    }
  }
  return chapters;
}

/**
 * Checks if summary is cached
 * @param videoId - id of video to check
 * @returns summary if cached, otherwise null
 */
export async function cachedSummary(videoId: string) {
  console.log(`Checking for cached summary for ${videoId}...`);
  return fetch("/api/cached_summary?v=" + videoId, {
    next: { revalidate: 0 },
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .catch((err) => console.log(err));
}

/**
 * Checks if a url is a valid youtube url
 */
export function isValidYoutubeUrl(url: string) {
  const linkRegex = new RegExp(
    "^(https?:\\/\\/)?((w){3}.)?youtu(be|.be)?(\\.com)?\\/.+"
  );

  return linkRegex.test(url);
}
