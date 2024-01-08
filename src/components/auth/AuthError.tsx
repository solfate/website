"use client";

import { memo, useEffect, useState } from "react";

export const AuthError = memo(() => {
  const [error, setError] = useState<string | null>("");

  useEffect(() => {
    const url = new URL(window.location.href);
    setError(url.searchParams.get("error"));
  }, []);

  if (!error) return null;

  return (
    <div className="card !bg-red-100 text-center border-red-200">
      {authErrorMessage(error)}
    </div>
  );
});

function authErrorMessage(error: string | null) {
  if (!error) return "";

  switch (error.toLowerCase()) {
    case "callback":
      return "An error occurred with the external provider (i.e. Twitter, GitHub, etc)";
  }

  // always
  return "An authentication error occurred";
}
