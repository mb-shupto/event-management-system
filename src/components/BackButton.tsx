"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type BackButtonProps = {
  href?: string;
  label?: string;
  ariaLabel?: string;
  className?: string;
  onClickAction?: () => void;
};

export default function BackButton({
  href,
  label = "Back",
  ariaLabel,
  className,
  onClickAction,
}: BackButtonProps) {
  const router = useRouter();

  const classes = [
    "inline-flex items-center gap-2 rounded-md border border-blue-400 px-4 py-2 text-sm font-semibold",
    "text-blue-400 transition hover:bg-blue-50",
    "focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2",
    className ?? "",
  ]
    .join(" ")
    .trim();

  const content = (
    <>
      <span aria-hidden="true" className="font-mono text-base leading-none">
        {"<-"}
      </span>
      <span>{label}</span>
    </>
  );

  if (href) {
    return (
      <Link href={"/admin/dashboard"} aria-label={ariaLabel ?? label} className={classes}>
        {content}
      </Link>
    );
  }

  return (
    <button
      type="button"
      aria-label={ariaLabel ?? label}
      className={classes}
      onClick={() => {
        onClickAction?.();
        if (!onClickAction) router.back();
      }}
    >
      {content}
    </button>
  );
}