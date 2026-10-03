"use client";

import { useId, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { EarlyAccessAlert } from "./early-access-alert";

// Stands in for the sign-in button while sign-up is invite-only (see
// src/lib/early-access.ts): it opens the request alert instead of Clerk's modal.
export function EarlyAccessButton() {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const alertId = useId();

  function close() {
    setOpen(false);
    buttonRef.current?.focus();
  }

  return (
    <>
      <Button
        ref={buttonRef}
        variant="secondary"
        className="profile-button"
        aria-label="Sign in or request early access"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={open ? alertId : undefined}
        onClick={() => setOpen((value) => !value)}
      >
        <Icon name="user" size={17} />
      </Button>
      {open && <EarlyAccessAlert id={alertId} onClose={close} />}
    </>
  );
}
