export const desc = "Summarize a youtube video in real time.";
export const title = "Magic Youtube";

export default function Head() {
  return (
    <>
      <title>{title}</title>
      <link rel="icon" href="/favicon.ico" />
      <meta name="description" content={desc} />
      <meta property="og:description" content={desc} />
      <meta property="og:title" content={desc} />
      <meta
        property="og:image"
        content="https://www.theindianwire.com/wp-content/uploads/2017/08/youtube_logo_new_official_1504077880072.jpg"
      />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={desc} />
      <meta name="twitter:card" content="summary_large_image"></meta>
      <meta
        name="twitter:image"
        content="https://www.theindianwire.com/wp-content/uploads/2017/08/youtube_logo_new_official_1504077880072.jpg"
      ></meta>
    </>
  );
}
