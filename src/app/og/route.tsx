import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";

export const runtime = "edge";

const WIDTH = 1200;
const HEIGHT = 630;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const title = (searchParams.get("title") ?? "Mondkalender 2026").slice(0, 80);
  const description = (
    searchParams.get("description") ??
    "Live in harmony with the moon. Plan haircuts, gardening, and wellness with precise lunar insights."
  ).slice(0, 160);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "60px 100px",
          background:
            "linear-gradient(135deg, #0b1026 0%, #1a2660 50%, #6b48ff 100%)",
          color: "#f8fafc",
          fontFamily: "Inter, system-ui, sans-serif",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 32 }}>
          <span style={{ fontWeight: 600 }}>Mondkalender</span>
          <span style={{ fontSize: 24, opacity: 0.8 }}>2026</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <h1
            style={{
              fontSize: 72,
              fontWeight: 700,
              lineHeight: 1.1,
              maxWidth: "880px",
            }}
          >
            {title}
          </h1>
          <p
            style={{
              fontSize: 32,
              lineHeight: 1.4,
              maxWidth: "840px",
              color: "rgba(248, 250, 252, 0.85)",
            }}
          >
            {description}
          </p>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 24,
            opacity: 0.9,
          }}
        >
          <span>macrsdepreciationcalculator.com</span>
          <span>Moon phase intelligence for every day</span>
        </div>
      </div>
    ),
    {
      width: WIDTH,
      height: HEIGHT,
    }
  );
}
