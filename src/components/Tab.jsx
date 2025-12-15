export default function Tab({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-full text-sm font-medium transition inline-flex items-center gap-2 ${
        active ? 'tab-active' : 'tab-inactive'
      }`}
    >
      <span className="w-2 h-2 rounded-full" style={{ background: active ? 'white' : 'transparent', boxShadow: active ? '0 0 8px rgba(255,255,255,0.12)' : 'none' }} />
      <span>{label}</span>
    </button>
  );
}
