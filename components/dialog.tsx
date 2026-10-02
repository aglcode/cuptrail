'use client';

import type { ComponentPropsWithRef } from 'react';

// Retain native modal focus restoration and Escape handling, and keep Tab
// cycling through the dialog's controls at both ends of the sequence.
export function Dialog({ onKeyDown, ...props }: ComponentPropsWithRef<'dialog'>) {
  return <dialog {...props} onKeyDown={event => {
    onKeyDown?.(event);
    if (event.defaultPrevented || event.key !== 'Tab') return;
    const controls = Array.from(event.currentTarget.querySelectorAll<HTMLElement>(
      'button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), a[href], [tabindex="0"]',
    )).filter(control => control.getClientRects().length > 0 && control.tabIndex >= 0);
    const first = controls[0];
    const last = controls.at(-1);
    if (event.shiftKey && event.target === first) {
      event.preventDefault();
      last?.focus();
    } else if (!event.shiftKey && event.target === last) {
      event.preventDefault();
      first?.focus();
    }
  }}/>;
}
