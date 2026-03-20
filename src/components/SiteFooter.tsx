export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border-subtle bg-surface px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <p className="text-center text-sm text-muted">
          © {new Date().getFullYear()} Thangamani Jeyam Motors. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
