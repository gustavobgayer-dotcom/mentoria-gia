export function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="flex flex-col h-screen mx-auto relative"
      style={{
        maxWidth: 430,
        background: "var(--bg)",
      }}
    >
      {children}
    </div>
  );
}
