import React, { useState, useMemo } from 'react';

// A single-file React component demoing discrete logarithm (baby-step giant-step) and
// Diffie-Hellman key exchange. Uses Tailwind classes for styling.
// Default export is the component so it can be previewed in the canvas.

export default function DiscreteDiffieDemo() {
  // Parameters
  const [p, setP] = useState(467); // prime modulus default (small for demo)
  const [g, setG] = useState(2); // generator
  const [a, setA] = useState(123); // private key A
  const [b, setB] = useState(77);  // private key B
  const [y, setY] = useState(1);   // target for discrete log (y = g^x mod p)

  // Helper: modular exponentiation
  function modPow(base, exp, mod) {
    // Use BigInt constructors (avoid literal `n` suffix) to maximize parser compatibility
    let result = BigInt(1);
    let b = BigInt(base) % BigInt(mod);
    let e = BigInt(exp);
    let m = BigInt(mod);
    while (e > BigInt(0)) {
      if ((e & BigInt(1)) !== BigInt(0)) result = (result * b) % m;
      b = (b * b) % m;
      e = e >> BigInt(1);
    }
    return Number(result);
  }

  // Compute public values and shared secrets
  const A_pub = useMemo(() => modPow(g, a, p), [g, a, p]);
  const B_pub = useMemo(() => modPow(g, b, p), [g, b, p]);
  const sharedA = useMemo(() => modPow(B_pub, a, p), [B_pub, a, p]);
  const sharedB = useMemo(() => modPow(A_pub, b, p), [A_pub, b, p]);

  // Baby-step giant-step discrete log solver (returns smallest x such that g^x = y mod p or null)
  function babyStepGiantStep(g0, y0, p0) {
    // All inputs as Numbers but convert to BigInt where needed
    const m = Math.ceil(Math.sqrt(p0 - 1));
    const table = new Map();
    let cur = 1n;
    const G = BigInt(g0);
    const P = BigInt(p0);
    for (let j = 0; j < m; j++) {
      if (!table.has(Number(cur))) table.set(Number(cur), j);
      cur = (cur * G) % P;
    }

    const factor = modPow(g0, p0 - 1 - m, p0); // g^{-m} mod p using Fermat
    let gamma = BigInt(y0);
    let gammaNum = Number(gamma % P);
    for (let i = 0; i <= m; i++) {
      const found = table.get(gammaNum);
      if (found !== undefined) {
        const x = i * m + found;
        if (modPow(g0, x, p0) === (y0 % p0)) return x;
      }
      gamma = (gamma * BigInt(factor)) % P;
      gammaNum = Number(gamma);
    }
    return null;
  }

  // Solve discrete log for current y
  const discreteLog = useMemo(() => {
    try {
      const res = babyStepGiantStep(g, y % p, p);
      return res;
    } catch (e) {
      return null;
    }
  }, [g, y, p]);

  // Small utility to test primality (for convenience only; small numbers fine)
  function isProbablyPrime(n) {
    if (n < 2) return false;
    if (n % 2 === 0) return n === 2;
    const r = Math.floor(Math.sqrt(n));
    for (let i = 3; i <= r; i += 2) if (n % i === 0) return false;
    return true;
  }

  // UI helpers to randomize small prime / generator
  function randomSmallPrime() {
    // pick a random prime between 200 and 1000 for demo
    const candidates = [];
    for (let i = 200; i < 1000; i++) if (isProbablyPrime(i)) candidates.push(i);
    return candidates[Math.floor(Math.random() * candidates.length)];
  }

  function findGeneratorForP(p0) {
    // naive search for small generator
    for (let cand = 2; cand < p0; cand++) {
      const seen = new Set();
      let cur = 1;
      for (let i = 0; i < p0 - 1; i++) {
        cur = modPow(cand, i, p0);
        seen.add(cur);
      }
      if (seen.size === p0 - 1) return cand;
    }
    return 2;
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-2xl p-6">
        <header className="mb-6">
          <h1 className="text-2xl font-bold">Discrete Log & Diffie-Hellman Interactive Demo</h1>
          <p className="text-sm text-slate-600 mt-1">Inspired by a reference demo, this page lets you play with modular exponentiation, solve discrete logs with baby-step giant-step, and run a Diffie-Hellman exchange.</p>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 border rounded-lg">
            <h2 className="font-semibold">Prime & Generator</h2>
            <div className="mt-3 space-y-2">
              <label className="block text-sm">Prime p (modulus)</label>
              <input className="w-full rounded p-2 border" type="number" value={p} onChange={(e)=>setP(Number(e.target.value)||2)} />
              <div className="flex gap-2 mt-2">
                <button className="px-3 py-1 rounded bg-slate-200" onClick={()=>setP(randomSmallPrime())}>Random prime</button>
                <button className="px-3 py-1 rounded bg-slate-200" onClick={()=>setG(findGeneratorForP(p))}>Find generator</button>
              </div>
              <div className="text-sm text-slate-500 mt-2">p is prime? <strong className="ml-2">{isProbablyPrime(p) ? 'Yes' : 'No'}</strong></div>
            </div>
          </div>

          <div className="p-4 border rounded-lg">
            <h2 className="font-semibold">Keys & Public Values</h2>
            <div className="mt-3 space-y-2">
              <label className="block text-sm">Generator g</label>
              <input className="w-full rounded p-2 border" type="number" value={g} onChange={(e)=>setG(Number(e.target.value)||2)} />

              <label className="block text-sm">Private key a (Alice)</label>
              <input className="w-full rounded p-2 border" type="number" value={a} onChange={(e)=>setA(Number(e.target.value)||0)} />

              <label className="block text-sm">Private key b (Bob)</label>
              <input className="w-full rounded p-2 border" type="number" value={b} onChange={(e)=>setB(Number(e.target.value)||0)} />

              <div className="mt-3 bg-slate-50 p-3 rounded">
                <div className="text-sm">Alice public A = g^a mod p = <strong>{A_pub}</strong></div>
                <div className="text-sm">Bob public B = g^b mod p = <strong>{B_pub}</strong></div>
                <div className="text-sm mt-2">Shared computed by Alice = B^a mod p = <strong>{sharedA}</strong></div>
                <div className="text-sm">Shared computed by Bob = A^b mod p = <strong>{sharedB}</strong></div>
                <div className={`text-sm mt-2 ${sharedA===sharedB ? 'text-green-600' : 'text-red-600'}`}>Match? <strong>{sharedA===sharedB ? 'Yes' : 'No'}</strong></div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 border rounded-lg">
            <h2 className="font-semibold">Discrete Log (Baby-step Giant-step)</h2>
            <div className="mt-3 space-y-2">
              <label className="block text-sm">Target value y (we'll try to find x where g^x = y mod p)</label>
              <input className="w-full rounded p-2 border" type="number" value={y} onChange={(e)=>setY(Number(e.target.value)||1)} />

              <div className="mt-3 bg-slate-50 p-3 rounded">
                <div className="text-sm">Solving for x such that <code>g^x = y (mod p)</code></div>
                <div className="text-sm mt-2">Result x = {discreteLog === null ? <em>not found / no solution</em> : <strong>{discreteLog}</strong>}</div>
                <div className="text-xs text-slate-500 mt-2">Note: For demonstration we use baby-step giant-step which is efficient for small p (sqrt(p)). Large p used in real crypto are chosen to make this infeasible.</div>
              </div>

              <div className="mt-3">
                <button className="px-3 py-1 rounded bg-indigo-600 text-white" onClick={()=>setY(A_pub)}>Set y = Alice's public A</button>
                <button className="ml-2 px-3 py-1 rounded bg-indigo-600 text-white" onClick={()=>setY(B_pub)}>Set y = Bob's public B</button>
              </div>
            </div>
          </div>

          <div className="p-4 border rounded-lg">
            <h2 className="font-semibold">Visual & Step Trace</h2>
            <div className="mt-3">
              <p className="text-sm text-slate-600">Below we show a small trace of g^k mod p for k from 0..15 to help see the cycle and repetition visually (useful when p is small).</p>
              <div className="mt-3 grid grid-cols-2 gap-2">
                {Array.from({length: 16}).map((_, i) => (
                  <div key={i} className="p-2 border rounded flex justify-between items-center">
                    <div className="text-xs">k = {i}</div>
                    <div className="font-mono">{modPow(g, i, p)}</div>
                  </div>
                ))}
              </div>

              <div className="mt-4 text-xs text-slate-500">
                Tip: If you set y = g^x mod p for some small x and then run the discrete log solver, it should recover that x. Try changing a or b, copy a public value into y, and solve.
              </div>
            </div>
          </div>
        </section>

        <footer className="mt-6 text-sm text-slate-500">
          <div>Notes: This demo is educational. Real-world cryptography uses very large primes (2048+ bits) and additional safeguards. Baby-step giant-step is a classical algorithm for discrete logarithm and demonstrates why large parameter sizes are important.</div>
        </footer>
      </div>
    </div>
  );
}

