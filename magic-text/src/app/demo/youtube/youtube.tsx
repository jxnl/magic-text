// react component to render a youtube video player

import React from "react";
import { extractVideoId } from "./utils";

export function Youtube(props: { url: string; ts: Number }) {
  const { url, ts } = props;
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
