"use client";

import { Show, SignInButton, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";

// Sign-in button or avatar. A client component on purpose: rendering Clerk's
// <Show> from a server component reads the session and makes the page dynamic.
export function HeaderAccount() {
  return (
    <>
      <Show when="signed-out">
        <SignInButton mode="modal">
          <Button
            variant="secondary"
            className="profile-button"
            aria-label="Sign in to Cuptrail"
          >
            <Icon name="user" size={17} />
          </Button>
        </SignInButton>
      </Show>
      <Show when="signed-in">
        <UserButton appearance={{ elements: { avatarBox: "w-11 h-11" } }} />
      </Show>
    </>
  );
}
