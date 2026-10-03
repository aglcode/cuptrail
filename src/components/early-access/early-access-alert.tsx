"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { useClerk } from "@clerk/nextjs";
import { isClerkAPIResponseError } from "@clerk/nextjs/errors";
import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";

type Status =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "success" }
  | { kind: "error"; message: string };

const FALLBACK_ERROR =
  "We couldn't send your request. Please try again in a moment.";

// Floating, non-modal request form. The email goes to Clerk's waitlist; approving
// it in the Clerk dashboard emails the invite.
export function EarlyAccessAlert({
  id,
  onClose,
}: {
  id: string;
  onClose: () => void;
}) {
  const clerk = useClerk();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const inputRef = useRef<HTMLInputElement>(null);
  const titleId = useId();
  const emailId = useId();
  const errorId = useId();

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus({ kind: "submitting" });
    try {
      await clerk.joinWaitlist({ emailAddress: email.trim() });
      setStatus({ kind: "success" });
    } catch (error) {
      const clerkError = isClerkAPIResponseError(error)
        ? error.errors[0]
        : undefined;
      setStatus({
        kind: "error",
        message:
          clerkError?.longMessage ?? clerkError?.message ?? FALLBACK_ERROR,
      });
    }
  }

  return (
    // The wrapper floats it: the Alert primitive needs its own `relative` position.
    <div className="fixed top-24 right-4 left-4 z-50 sm:left-auto sm:w-96">
      <Alert
        id={id}
        role="dialog"
        aria-labelledby={titleId}
        className="p-5 shadow-xl has-data-[slot=alert-action]:pr-5 *:[svg]:text-primary"
      >
        <Icon name="lock" className="size-5" />
        <AlertTitle id={titleId} className="pr-10 text-base font-semibold">
          Request early access
        </AlertTitle>
        <AlertDescription>
          Cuptrail is invite-only while we build it. Leave your email and
          we&apos;ll send you an invite.
        </AlertDescription>
        <AlertAction className="top-2 right-2">
          <Button
            variant="ghost"
            size="icon"
            className="size-11"
            aria-label="Close"
            onClick={onClose}
          >
            <Icon name="close" size={18} />
          </Button>
        </AlertAction>

        <div className="col-span-full mt-4">
          {status.kind === "success" ? null : (
            <form onSubmit={handleSubmit} className="grid gap-2">
              <label htmlFor={emailId} className="field-label">
                Email address
              </label>
              <Input
                ref={inputRef}
                id={emailId}
                type="email"
                name="email"
                autoComplete="email"
                required
                placeholder="you@example.com"
                className="h-11"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                aria-invalid={status.kind === "error" || undefined}
                aria-describedby={status.kind === "error" ? errorId : undefined}
              />
              <Button
                type="submit"
                className="h-11"
                disabled={status.kind === "submitting"}
              >
                {status.kind === "submitting" ? "Sending…" : "Request access"}
              </Button>
            </form>
          )}

          <div aria-live="polite">
            {status.kind === "success" && (
              <p className="flex items-center gap-2 font-medium">
                <Icon name="check" size={16} className="text-primary" />
                You&apos;re on the list. We&apos;ll email your invite.
              </p>
            )}
            {status.kind === "error" && (
              <p id={errorId} className="mt-2 text-destructive">
                {status.message}
              </p>
            )}
          </div>

          <p className="mt-4 flex items-center gap-1 text-muted-foreground">
            Already invited?
            <Button
              variant="link"
              className="h-11 px-1"
              onClick={() => {
                onClose();
                clerk.openSignIn();
              }}
            >
              Sign in
            </Button>
          </p>
        </div>
      </Alert>
    </div>
  );
}
