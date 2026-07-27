function NotFound() {
  return (
    <div className="flex h-screen items-center justify-center bg-[var(--color-bg)]">
      <div className="text-center">
        <h1 className="text-7xl font-bold text-[var(--color-primary)]">
          404
        </h1>

        <p className="mt-4 text-xl text-[var(--color-text-primary)]">
          Page Not Found
        </p>

        <p className="mt-2 text-[var(--color-text-muted)]">
          The page you're looking for doesn't exist.
        </p>
      </div>
    </div>
  );
}

export default NotFound;