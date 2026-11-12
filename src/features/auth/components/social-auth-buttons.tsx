"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export function SocialAuthButtons({ mode }: { mode: "login" | "register" }) {
  const [provider, setProvider] = useState<string | null>(null);
  const action = mode === "login" ? "Sign in" : "Sign up";
  return (
    <div className="grid gap-4">
      <div className="flex items-center gap-4" aria-label="Or continue with">
        <span className="h-px flex-1 bg-border" />
        <span className="text-[11px] font-medium uppercase text-muted">Or</span>
        <span className="h-px flex-1 bg-border" />
      </div>
      <div className="grid grid-cols-1 gap-2 min-[400px]:grid-cols-2">
        <Button
          variant="outline"
          className="h-10 w-full gap-2 px-2! text-[11px]! font-medium!"
          onClick={() => setProvider("Google")}
        >
          <svg viewBox="0 0 48 48" className="size-[18px] shrink-0" aria-hidden="true">
            <path
              fill="#4285F4"
              d="M43.6 24.5c0-1.4-.1-2.8-.4-4.2H24v8h11a9.4 9.4 0 0 1-4.1 6.2v5.2h6.7c3.9-3.6 6-8.8 6-15.2Z"
            />
            <path
              fill="#34A853"
              d="M24 44c5.5 0 10.1-1.8 13.5-4.9l-6.7-5.2c-1.8 1.2-4.1 1.9-6.8 1.9-5.3 0-9.8-3.6-11.4-8.4H5.7v5.4A20.4 20.4 0 0 0 24 44Z"
            />
            <path
              fill="#FBBC05"
              d="M12.6 27.4a12.2 12.2 0 0 1 0-7.8v-5.4H5.7a20.4 20.4 0 0 0 0 18.6l6.9-5.4Z"
            />
            <path
              fill="#EA4335"
              d="M24 11.2c3 0 5.6 1 7.7 3l5.8-5.8A19.5 19.5 0 0 0 24 3a20.4 20.4 0 0 0-18.3 11.2l6.9 5.4A12 12 0 0 1 24 11.2Z"
            />
          </svg>
          {action} with Google
        </Button>
        <Button
          variant="outline"
          className="h-10 w-full gap-2 px-2! text-[11px]! font-medium!"
          onClick={() => setProvider("Facebook")}
        >
          <svg
            viewBox="0 0 24 24"
            className="size-[18px] shrink-0 text-[#1877F2]"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M15.7 13.5 16.4 9H12V6.1c0-1.3.6-2.4 2.5-2.4h2.1V.2A25.9 25.9 0 0 0 13.5 0C10.3 0 8 2 8 5.7V9H4.5v4.5H8V24h4V13.5h3.7Z" />
          </svg>
          {action} with Facebook
        </Button>
      </div>
      {provider && (
        <p role="status" className="text-center text-[11px] leading-5 text-muted">
          {provider} sign-in is not configured for this template.
        </p>
      )}
    </div>
  );
}
