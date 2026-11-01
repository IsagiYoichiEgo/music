export default function LoadingBar({ message }: { message: string }) {
  if (!message) return null;
  return <div className="loading-banner" role="status" aria-live="polite">
    <span className="spinner" aria-hidden="true" />{message}
  </div>;
}
