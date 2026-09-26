export default function Logo({ className = '' }) {
  return (
    <img
      src="/logo.png"
      alt=""
      style={{ height: 60, width: 70 }}
      className={`shrink-0 object-contain ${className}`}
      aria-hidden="true"
    />
  );
}