"use client";

export default function GlobalError() {
  return (
    <html lang="en">
      <body>
        <main
          style={{
            minHeight: "100vh",
            display: "grid",
            placeItems: "center",
            fontFamily: "Inter, sans-serif",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <h1 style={{ marginBottom: 8 }}>Something went wrong</h1>
            <p>Please reload this page.</p>
          </div>
        </main>
      </body>
    </html>
  );
}
