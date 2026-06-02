import { ImageResponse } from "next/og";

export const alt = "Three Dots — three replies that fit how you actually want to sound";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px",
          background: "#fdfbf7",
          fontFamily: "serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            fontSize: 24,
            color: "#5a4f3f",
            letterSpacing: "0.04em",
            textTransform: "uppercase",
          }}
        >
          Three Dots
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: 80,
              lineHeight: 1.05,
              color: "#1f1810",
              fontWeight: 500,
              letterSpacing: "-0.025em",
              maxWidth: 1000,
            }}
          >
            <span>Stop staring at the keyboard.</span>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: 32,
              color: "#5a4f3f",
              marginTop: 32,
              maxWidth: 900,
              lineHeight: 1.4,
            }}
          >
            <span>
              Three replies, each with the reason it works. Paste the chat, tell
              it how you feel, send the one that sounds like you.
            </span>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            color: "#8a7d6a",
            fontSize: 22,
          }}
        >
          <div>three-dots.four.tools</div>
          <div>Free for 5 conversations a month</div>
        </div>
      </div>
    ),
    size
  );
}
