"use client";

import { MeshGradient } from "@paper-design/shaders-react";

const HERO_COLORS = ["#000000", "#06b6d4", "#0891b2", "#164e63", "#f97316"];
const WIRE_COLORS = ["#000000", "#ffffff", "#06b6d4", "#f97316"];

export default function ShaderBackground() {
  return (
    <>
      <MeshGradient
        className="absolute inset-0 w-full h-full"
        colors={HERO_COLORS}
        speed={0.3}
        distortion={0.8}
        swirl={0.1}
        style={{ width: "100%", height: "100%" }}
      />
      <MeshGradient
        className="absolute inset-0 w-full h-full opacity-60"
        colors={WIRE_COLORS}
        speed={0.2}
        distortion={0.6}
        swirl={0.15}
        style={{ width: "100%", height: "100%" }}
      />
    </>
  );
}
