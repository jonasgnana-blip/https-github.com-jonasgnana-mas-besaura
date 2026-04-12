// Root admin layout — no auth here.
// Auth is enforced in app/admin/(protected)/layout.tsx
// This wrapper exists only so /admin/login can render without a redirect loop.

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
