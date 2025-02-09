"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

interface SearchBarProps {
  initialQuery?: string;
}

export default function SearchBar({ initialQuery = "" }: SearchBarProps) {
  const [query, setQuery] = useState(initialQuery);
  const router = useRouter();

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const newValue = e.target.value;
    setQuery(newValue);

    // If the input is fully cleared, revert to the full list automatically
    if (newValue.trim() === "") {
      router.replace("/activites"); 
      // This removes "?q=" from the URL so the server returns all results.
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = query.trim();

    if (trimmed) {
      router.replace(`/activites?query=${encodeURIComponent(trimmed)}`);
    } else {
      router.replace("/activites");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="search-bar">
      <input
        type="search"
        placeholder="Rechercher par nom..."
        value={query}
        onChange={handleChange}
      />
      <button type="submit">Rechercher</button>
    </form>
  );
}
