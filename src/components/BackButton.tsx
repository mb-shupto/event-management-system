"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

type BackButtonProps = {
  href?: string;
  label?: string;
  ariaLabel?: string;
  className?: string;
  onClickAction?: () => void;
};

function getParentPath(pathname: string) {
  const clean = pathname.split("?")[0].split("#")[0].replace(/\/+$/, "");
  const parts = clean.split("/").filter(Boolean);

  if (parts.length <= 1) return "/";

  parts.pop();
  return `/${parts.join("/")}`;
}

export default function BackButton({
  href,
  label = "Back",
  ariaLabel,
  className,
  onClickAction,
}: BackButtonProps) {
  const router = useRouter();
  const pathname = usePathname();

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
      <Link href={href} aria-label={ariaLabel ?? label} className={classes}>
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
        router.push(getParentPath(pathname));
      }}
    >
      {content}
    </button>
  );
}