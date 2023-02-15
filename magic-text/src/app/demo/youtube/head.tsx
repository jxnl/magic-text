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
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={desc} />
      <meta name="twitter:card" content="summary_large_image"></meta>
      <meta
        name="twitter:image"
        content="https://cdn.discordapp.com/attachments/990816889657778196/1071941320052047953/CJ_EatinStarz_knight_Hacking_on_computer_matrix_071dc515-5af4-4911-a45f-2c2638863719.png"
      ></meta>
    </>
  );
}
