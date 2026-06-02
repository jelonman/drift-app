import { ImageResponse } from "next/og";

export const alt = "omicron — small tools for the things you keep meaning to do";
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
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 12,
              background: "#3d2e1f",
              color: "#fdfbf7",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 36,
              fontWeight: 600,
            }}
          >
            f
          </div>
          <div
            style={{
              fontSize: 32,
              color: "#3d2e1f",
              fontWeight: 500,
              letterSpacing: "-0.01em",
            }}
          >
            Four
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: 88,
              lineHeight: 1.05,
              color: "#1f1810",
              fontWeight: 500,
              letterSpacing: "-0.025em",
              maxWidth: 1000,
            }}
          >
            <span>The friction in your life,</span>
            <span>four small fixes.</span>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: 28,
              color: "#5a4f3f",
              marginTop: 32,
              maxWidth: 900,
              lineHeight: 1.4,
            }}
          >
            <span>Three Dots. Tag In. Tonight. Still Here.</span>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            color: "#8a7d6a",
            fontSize: 24,
          }}
        >
          <div>four.tools</div>
          <div>No streaks. No badges. Just done.</div>
        </div>
      </div>
    ),
    size
  );
}
