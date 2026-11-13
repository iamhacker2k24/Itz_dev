"use client";

import dynamic from "next/dynamic";

const DevAIComponent = dynamic(() => import("./dev_ai"), {
  ssr: false,
});

export default function DevAIWrapper() {
  return <DevAIComponent />;
}

