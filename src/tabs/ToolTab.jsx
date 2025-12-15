import React, { useState, useMemo } from 'react';
import { Section, Result, Formula } from '../components/UI';
import { modPow } from '../crypto/diffieHellman';

// brute-force discrete log (for small p, demo only)
function discreteLogBruteforce(g, A, p) {
  for (let x = 0; x < p; x++) {
    if (modPow(g, x, p) === A) return x;
  }
  return null;
}

export default function ToolTab() {
  // ===== Diffie–Hellman demo =====
  const [p, setP] = useState(467);
  const [g, setG] = useState(2);
  const [a, setA] = useState(123);
  const [b, setB] = useState(77);
  const [copied, setCopied] = useState('');

  function copyToClipboard(label, value) {
    if (navigator && navigator.clipboard) {
      navigator.clipboard.writeText(String(value));
      setCopied(label);
      setTimeout(()=> setCopied(''), 1500);
    }
  }

  function isProbablyPrime(n) {
    if (n < 2) return false;
    if (n % 2 === 0) return n === 2;
    const r = Math.floor(Math.sqrt(n));
    for (let i = 3; i <= r; i += 2) if (n % i === 0) return false;
    return true;
  }

  function randomSmallPrime() {
    const candidates = [];
    for (let i = 200; i < 1000; i++) if (isProbablyPrime(i)) candidates.push(i);
    return candidates[Math.floor(Math.random()*candidates.length)];
  }

  const A = useMemo(() => modPow(g, a, p), [g, a, p]);
  const B = useMemo(() => modPow(g, b, p), [g, b, p]);
  const shared = useMemo(() => modPow(B, a, p), [B, a, p]);

  // ===== Discrete log solver =====
  const [dg, setDg] = useState(2);
  const [dA, setDA] = useState(228);
  const [dp, setDp] = useState(467);

  const dlog = useMemo(() => discreteLogBruteforce(dg, dA, dp), [dg, dA, dp]);

  return (
    <div className="space-y-8 max-w-5xl">
  <div className="grid grid-cols-2 gap-6">

        <Section title="Diffie–Hellman (demo + giải mã khi p nhỏ)">
          <div className="grid grid-cols-3 gap-6">
            <div className="space-y-3 card-white">
              <label className="label">p (số nguyên tố)</label>
              <div className="flex gap-2">
                <input className="w-full" value={p} onChange={e=>setP(Number(e.target.value)||0)} />
                <button className="btn btn-accent" onClick={()=>setP(randomSmallPrime())}>Random p</button>
              </div>
              <div className="text-xs text-slate-500">Trạng thái: <strong className="ml-2">{isProbablyPrime(p) ? 'Prime' : 'Not prime'}</strong></div>

              <label className="label">g (generator)</label>
              <input className="w-full" value={g} onChange={e=>setG(Number(e.target.value)||0)} />

              <label className="label">a (Alice secret)</label>
              <div className="flex gap-2">
                <input className="w-full" value={a} onChange={e=>setA(Number(e.target.value)||0)} />
                <button className="btn btn-accent" onClick={()=>setA(Math.floor(Math.random()* (p-2) ) +1)}>Random</button>
              </div>

              <label className="label">b (Bob secret)</label>
              <div className="flex gap-2">
                <input className="w-full" value={b} onChange={e=>setB(Number(e.target.value)||0)} />
                <button className="btn btn-accent" onClick={()=>setB(Math.floor(Math.random()* (p-2) ) +1)}>Random</button>
              </div>
            </div>

            <div className="space-y-3 card-white flex flex-col justify-between">
              <div className="grid gap-3">
                <div className="flex items-center justify-between">
                  <Result compact label={<Formula inline>A = g^a mod p</Formula>} value={A} />
                  <button className="btn btn-ghost" onClick={()=>copyToClipboard('A',A)}>{copied==='A'?'Copied':'Copy'}</button>
                </div>

                <div className="flex items-center justify-between">
                  <Result compact label={<Formula inline>B = g^b mod p</Formula>} value={B} />
                  <button className="btn btn-ghost" onClick={()=>copyToClipboard('B',B)}>{copied==='B'?'Copied':'Copy'}</button>
                </div>

                <div className="flex items-center justify-between">
                  <Result compact label={<span>Shared</span>} value={shared} highlight />
                  <button className="btn btn-ghost" onClick={()=>copyToClipboard('Shared',shared)}>{copied==='Shared'?'Copied':'Copy'}</button>
                </div>
              </div>
              <div className="text-xs text-slate-500 mt-2">Ghi chú: Với p nhỏ, khóa chung có thể bị phá bằng công cụ Discrete Log bên dưới.</div>
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            ⚠️ Chỉ mang tính minh họa. Với p nhỏ, Diffie–Hellman có thể bị phá bằng Discrete Log.
          </p>
        </Section>

        <Section title="Discrete Logarithm – Tool giải mã (Brute-force)">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-3 p-3 bg-white border rounded">
              <label>g</label>
              <input className="w-full border p-1" value={dg} onChange={e=>setDg(+e.target.value)} />
              <label><Formula inline>A = g^x mod p</Formula></label>
              <input className="w-full border p-1" value={dA} onChange={e=>setDA(+e.target.value)} />
              <label>p</label>
              <input className="w-full border p-1" value={dp} onChange={e=>setDp(+e.target.value)} />
            </div>
            <div className="p-3 bg-white border rounded flex items-center justify-center">
              <Result
                label={<span>x (Discrete log)</span>}
                value={dlog === null ? 'Không tìm được (p quá lớn)' : dlog}
                highlight={dlog !== null}
              />
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            Công cụ này minh họa cách phá Discrete Log khi p nhỏ (brute-force). Với p chuẩn NIST (2048-bit), cách này là bất khả thi.
          </p>
        </Section>
      </div>
    </div>
  );
}
