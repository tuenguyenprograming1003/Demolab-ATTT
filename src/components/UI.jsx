export function Section({ title, children }) {
  return (
    <div className="card-clean">
      <h2 className="font-semibold mb-3" style={{fontSize: '1.05rem'}}>{title}</h2>
      <div className="space-y-3 text-sm">{children}</div>
    </div>
  );
}

export function Formula({ children, inline = false }) {
  // children expected to be a string like "g^x" or "g^{x+1}" or a React node
  function parseSup(text) {
    if (typeof text !== 'string') return text;
    // handle { } groups and plain ^x
    const parts = [];
    let i = 0;
    while (i < text.length) {
      const idx = text.indexOf('^', i);
      if (idx === -1) {
        parts.push(text.slice(i));
        break;
      }
      // push before ^
      if (idx > i) parts.push(text.slice(i, idx));
      i = idx + 1;
      if (text[i] === '{') {
        const end = text.indexOf('}', i + 1);
        if (end === -1) {
          parts.push(<sup key={i}>{text.slice(i + 1)}</sup>);
          break;
        }
        parts.push(<sup key={i}>{text.slice(i + 1, end)}</sup>);
        i = end + 1;
      } else {
        parts.push(<sup key={i}>{text[i]}</sup>);
        i += 1;
      }
    }
    return parts;
  }

  const className = inline ? 'formula inline-formula' : 'my-2 p-3 bg-slate-100 rounded font-serif text-center formula card-white';
  return (
    <div className={className}>
      {parseSup(children)}
    </div>
  );
}

export function Exercise({ children }) {
  return (
    <div className="p-3 bg-white border rounded-lg">{children}</div>
  );
}

export function Result({ label, value, highlight, compact }) {
  const base = compact ? 'result-compact' : 'p-3 rounded border card-white';
  const bgClass = highlight ? ' bg-green-50 border-green-300' : '';
  return (
    <div className={base + bgClass}>
      <div className="text-xs text-slate-500">{label}</div>
      <div className={compact ? 'font-mono text-base' : 'font-mono text-lg'}>{value}</div>
    </div>
  );
}
