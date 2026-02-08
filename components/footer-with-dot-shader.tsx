"use client";

import { Suspense } from "react";
import { DotScreenShader } from "./ui/dot-shader-background";
import { ZaprintFooter } from "./Zaprint-footer";

export function FooterWithDotShader() {
  return (
    <section className="relative w-full min-h-[60vh] overflow-hidden">
      {/* Dot shader background - constrained to bottom, light mask from top */}
      <div
        className="absolute inset-0 z-0 opacity-80 [mask-image:linear-gradient(to_bottom,transparent_0%,black_30%,black_100%)] [-webkit-mask-image:linear-gradient(to_bottom,transparent_0%,black_30%,black_100%)]"
        style={{ minHeight: "100%" }}
      >
        <Suspense fallback={null}>
          <DotScreenShader />
        </Suspense>
      </div>
      {/* Footer content on top */}
      <div className="relative z-10">
        <ZaprintFooter />
      </div>
    </section>
  );
}
