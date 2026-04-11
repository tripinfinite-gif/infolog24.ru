import { ImageResponse } from "next/og";

// Маршрут /icon — Next.js использует его как favicon (см. https://nextjs.org/docs/app/api-reference/file-conventions/metadata/app-icons)
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
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
          fontSize: 22,
          fontWeight: 900,
          fontFamily: "system-ui",
          borderRadius: 8,
        }}
      >
        и
      </div>
    ),
    { ...size }
  );
}
