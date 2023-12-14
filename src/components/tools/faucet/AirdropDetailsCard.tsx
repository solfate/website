"use client";

import { memo, useCallback, useState } from "react";
import styles from "@/styles/card.module.css";
import { AirdropDetails } from "@/types/tools";
import Link from "next/link";
import { FeatherIcon } from "@/components/core/FeatherIcon";

type ComponentProps = {
  tx: AirdropDetails;
  title?: string;
  msg?: string;
};

export const AirdropDetailsCard = memo(
  ({
    tx,
    title = "An error occurred!",
    msg = "An unknown error occurred. Please try again.",
  }: ComponentProps) => {
    // state used for the `copyToClipboard` function
    const [enabled, setEnabled] = useState(true);
    const [displayText, setDisplayText] = useState(tx.signature);

    // Simple function to copy the `displayText` to the clipboard and show a UI change
    const copyToClipboard = useCallback(() => {
      if (!enabled) return;

      navigator.clipboard.writeText(displayText);
      let tmp = displayText;

      setDisplayText("Copied to clipboard!");
      setEnabled(false);

      setTimeout(() => {
        setDisplayText(tmp);
        setEnabled(true);
      }, 700);
    }, [displayText, setDisplayText, setEnabled, enabled]);

    return (
      <div className={`shadow ${styles.card} bg-white p-5 space-y-2`}>
        <h6 className="inline-flex space-x-1 text-lg heading">
          <span>Transaction confirmed</span>
          <span className="hidden md:inline">
            on <span className="text-hot-pink font-semibold">{tx.network}</span>
          </span>
        </h6>

        <div
          className="space-x-2 text-gray-500 cursor-pointer flex items-center"
          onClick={copyToClipboard}
        >
          <p className="w-full line-clamp-1">{displayText}</p>
          <FeatherIcon name="Clipboard" />
        </div>

        <p className="space-x-3 text-sm text-gray-700">
          <Link
            href={`https://explorer.solana.com/tx/${tx.signature}?cluster=${tx.network}`}
            className="underline hover:text-hot-pink"
            target="_blank"
            rel="noreferrer"
          >
            <span className="hidden md:inline">Solana</span> Explorer
          </Link>
          <span>&#8226;</span>
          <Link
            href={`https://solscan.io/tx/${tx.signature}?cluster=${tx.network}`}
            target="_blank"
            className="underline hover:text-hot-pink"
          >
            Solscan
          </Link>
          <span>&#8226;</span>
          <Link
            href={`https://solana.fm/tx/${tx.signature}?cluster=${tx.network}-solana`}
            className="underline hover:text-hot-pink"
            target="_blank"
            rel="noreferrer"
          >
            Solana.fm
          </Link>
        </p>
      </div>
    );
  },
);
