// react component to render a youtube video player

import React from "react";

function extract_video_id(url: string) {
  const regex = /(?:v=)([a-zA-Z0-9_-]+)/;
  const videoId = url.match(regex);
  if (videoId === null) {
    return null;
  } else {
    return videoId[1];
  }
}

export function Youtube(props: { url: string; ts: Number }) {
  const url = props.url;
  const ts = props.ts;
  const videoId = extract_video_id(url);

  if (videoId === null) {
    return <div>Invalid youtube url</div>;
  }

  return (
    <div>
      <iframe
        className="aspect-video w-full"
        src={`https://www.youtube.com/embed/${videoId}?start=${ts}&autoplay=${
          1 ? ts > 0 : 0
        }`}
        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}
