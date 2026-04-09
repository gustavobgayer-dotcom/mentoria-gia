export function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="flex flex-col mx-auto relative"
      style={{ height: "100dvh", maxWidth: 430, background: "var(--bg)" }}
    >
      {children}
    </div>
  );
}
