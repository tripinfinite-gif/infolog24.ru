import { ImageResponse } from "next/og";

// Apple touch icon — для iOS Home Screen.
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#E97316",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          fontSize: 120,
          fontWeight: 900,
          fontFamily: "system-ui",
          borderRadius: 32,
        }}
      >
        и
      </div>
    ),
    { ...size }
  );
}
