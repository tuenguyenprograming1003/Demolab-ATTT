import React, { useState, useMemo } from 'react';
import { Section, Result } from '../components/UI';
import { PageLayout } from '../components/layout/PageLayout';
import { Card } from '../components/ui/Card';
import { modPow } from '../crypto/diffieHellman';

// brute-force discrete log (demo-only, small p)
function discreteLogBruteforce(g, A, p) {
  for (let x = 0; x < p; x++) {
    if (modPow(g, x, p) === A) return x;
  }
  return null;
}

function isProbablyPrime(n) {
  if (!Number.isFinite(n) || n < 2) return false;
  if (n % 2 === 0) return n === 2;
  const r = Math.floor(Math.sqrt(n));
  for (let i = 3; i <= r; i += 2) if (n % i === 0) return false;
  return true;
}

function randomSmallPrime() {
  const candidates = [];
  for (let i = 200; i < 1000; i++) if (isProbablyPrime(i)) candidates.push(i);
  return candidates[Math.floor(Math.random() * candidates.length)];
}

export default function ToolTab() {
  // Core DH state
  const [p, setP] = useState(467);
  const [g, setG] = useState(2);
  const [a, setA] = useState(123);
  const [b, setB] = useState(77);
  const [copied, setCopied] = useState('');

  const A = useMemo(() => modPow(g, a, p), [g, a, p]);
  const B = useMemo(() => modPow(g, b, p), [g, b, p]);
  const shared = useMemo(() => modPow(B, a, p), [B, a, p]);

  // Discrete log demo
  const [dg, setDg] = useState(2);
  const [dA, setDA] = useState(228);
  const [dp, setDp] = useState(467);
  const dlog = useMemo(() => discreteLogBruteforce(dg, dA, dp), [dg, dA, dp]);

  // Recovery & puzzle (removed)

  function copyToClipboard(label, value) {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(String(value));
      setCopied(label);
      setTimeout(() => setCopied(''), 1200);
    }
  }

  // puzzle helpers removed

  return (
    <PageLayout title="🧰 Công cụ & Thực nghiệm">
      <div className="max-w-none">
        {/* Two-column tool layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* LEFT — Diffie–Hellman */}
          <div>
            <Card>
            <Section title="Diffie–Hellman (tool)">
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium">p (số nguyên tố)</label>
                  <div className="flex gap-2">
                    <input className="flex-1 h-10 px-3 border rounded-lg" value={p} onChange={(e) => setP(Number(e.target.value) || 0)} />
                    <button className="h-10 px-3 rounded-lg btn btn-accent" onClick={() => setP(randomSmallPrime())}>Random</button>
                  </div>
                  <div className="text-xs text-slate-500">Trạng thái: <strong className="ml-2">{isProbablyPrime(p) ? 'Prime' : 'Not prime'}</strong></div>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium">g (generator)</label>
                  <input className="h-10 px-3 border rounded-lg w-full" value={g} onChange={(e) => setG(Number(e.target.value) || 0)} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium">a (Alice secret)</label>
                    <div className="flex gap-2">
                      <input className="flex-1 h-10 px-3 border rounded-lg" value={a} onChange={(e) => setA(Number(e.target.value) || 0)} />
                      <button className="h-10 px-3 rounded-lg btn btn-accent" onClick={() => setA(Math.floor(Math.random() * (Math.max(3, p) - 2)) + 1)}>Random</button>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">b (Bob secret)</label>
                    <div className="flex gap-2">
                      <input className="flex-1 h-10 px-3 border rounded-lg" value={b} onChange={(e) => setB(Number(e.target.value) || 0)} />
                      <button className="h-10 px-3 rounded-lg btn btn-accent" onClick={() => setB(Math.floor(Math.random() * (Math.max(3, p) - 2)) + 1)}>Random</button>
                    </div>
                  </div>
                </div>

                <div className="mt-3 space-y-3">
                  <div className="card-white p-3 flex items-center justify-between">
                    <div>
                      <div className="text-xs text-slate-500">A = gᵃ mod p</div>
                      <div className="text-lg font-mono font-semibold">{A}</div>
                    </div>
                    <button className="h-10 text-sm text-indigo-600 hover:underline" onClick={() => copyToClipboard('A', A)}>{copied === 'A' ? 'Copied' : 'Copy'}</button>
                  </div>

                  <div className="card-white p-3 flex items-center justify-between">
                    <div>
                      <div className="text-xs text-slate-500">B = gᵇ mod p</div>
                      <div className="text-lg font-mono font-semibold">{B}</div>
                    </div>
                    <button className="h-10 text-sm text-indigo-600 hover:underline" onClick={() => copyToClipboard('B', B)}>{copied === 'B' ? 'Copied' : 'Copy'}</button>
                  </div>

                  <div className="card-white p-3 flex items-center justify-between">
                    <div>
                      <div className="text-xs text-slate-500">Shared key</div>
                      <div className="text-lg font-mono font-semibold">{shared}</div>
                    </div>
                    <button className="h-10 text-sm text-indigo-600 hover:underline" onClick={() => copyToClipboard('Shared', shared)}>{copied === 'Shared' ? 'Copied' : 'Copy'}</button>
                  </div>
                </div>
              </div>
            </Section>
            </Card>
          </div>
          {/* RIGHT — Discrete Log */}
          <div>
            <Card>
            <Section title="Discrete Logarithm (Brute-force)">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">g</label>
                  <div className="flex gap-2">
                    <input className="flex-1 h-10 px-3 border rounded-lg" value={dg} onChange={(e) => setDg(+e.target.value)} />
                    <button className="h-10 px-3 rounded-lg btn btn-accent" onClick={() => setDg(Math.max(2, Math.floor(Math.random() * (Math.max(3, p) - 2)) + 1))}>Random</button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium">A = g^x mod p</label>
                    <input className="h-10 px-3 border rounded-lg w-full" value={dA} onChange={(e) => setDA(+e.target.value)} />
                  </div>
                  <div>
                    <label className="text-sm font-medium">p</label>
                    <input className="h-10 px-3 border rounded-lg w-full" value={dp} onChange={(e) => setDp(+e.target.value)} />
                  </div>
                </div>

                <div className="mt-2">
                  <div className="card-white p-3">
                    <div className="text-sm text-slate-600">x (Discrete log)</div>
                    <div className="text-lg font-mono font-semibold">{dlog === null ? 'Không tìm được (p quá lớn)' : dlog}</div>
                  </div>
                </div>
                <div className="text-xs text-slate-500">Minh họa brute-force chỉ cho p nhỏ.</div>
              </div>
            </Section>
            </Card>
          </div>
        </div>

  {/* Puzzle section removed */}

  {/* Recovery cards removed */}
      </div>
    </PageLayout>
  );
}
