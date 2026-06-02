import { ImageResponse } from "next/og";

export const alt = "Tag In — stop being the one who remembers everything";
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
          Tag In
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
            <span>You should not be the one</span>
            <span>who remembers everything.</span>
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
              Snap a school flyer. Forward a text from the teacher. Tag In pulls
              out the tasks and splits them between you and your partner.
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
          <div>tag-in.four.tools</div>
          <div>Free for 14 days of planning</div>
        </div>
      </div>
    ),
    size
  );
}
