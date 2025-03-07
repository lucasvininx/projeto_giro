"use client";

import type React from "react";

// This file is no longer needed as we're using SessionProvider directly in layout.tsx
// We can delete this file or keep it as a placeholder if needed
export function AuthProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
