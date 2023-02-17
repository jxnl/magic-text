// react component to render a youtube video player

import React from "react";

function extractVideoId(url: string) {
  const videoId = url.match(
    /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/
  );
  if (videoId === null) {
    return null;
  } else {
    return videoId[1];
  }
}

export function Youtube(props: { url: string; ts: Number }) {
  const url = props.url;
  const ts = props.ts;
  const videoId = extractVideoId(url);

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
