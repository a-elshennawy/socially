export function linkify(text) {
  if (!text) return text;

  const urlRegex = /(https?:\/\/[^\s]+|www\.[^\s]+)/g;

  const urls = text.match(urlRegex) || [];
  let lastIndex = 0;
  const result = [];

  urls.forEach((url, index) => {
    const urlStart = text.indexOf(url, lastIndex);

    if (urlStart > lastIndex) {
      result.push(text.substring(lastIndex, urlStart));
    }

    const displayUrl = url.startsWith("www.") ? `http://${url}` : url;
    const hrefUrl = url.startsWith("www.") ? `http://${url}` : url;

    result.push(
      <a
        key={`url-${index}`}
        href={hrefUrl}
        target="_blank"
        rel="noopener noreferrer"
        style={{ color: "#1a73e8", textDecoration: "underline" }}
      >
        {displayUrl}
      </a>
    );

    lastIndex = urlStart + url.length;
  });

  if (lastIndex < text.length) {
    result.push(text.substring(lastIndex));
  }

  return result.length ? result : text;
}
