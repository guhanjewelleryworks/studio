
'use client';

import React from 'react';

// This component is purely presentational.
// All styling and animation logic is handled in globals.css for performance.

export function Snowfall() {
  // Generate a fixed number of snowflakes
  const snowflakeCount = 150;
  const snowflakes = Array.from({ length: snowflakeCount }).map((_, i) => (
    <div key={i} className="snowflake" />
  ));

  return (
    <div
      aria-hidden="true"
      className="snowfall-container"
    >
      {snowflakes}
    </div>
  );
}
