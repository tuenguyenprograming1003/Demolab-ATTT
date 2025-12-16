import React, { useState } from 'react';
import { Section, Exercise, Formula, Result } from '../components/UI';
import { PageLayout } from '../components/layout/PageLayout';
import { Card } from '../components/ui/Card';
import { modPow } from '../crypto/diffieHellman';

// brute-force discrete log (small p only)
function discreteLogBruteforce(g, A, p) {
  for (let x = 0; x < p; x++) if (modPow(g, x, p) === A) return x;
  return null;
}

export default function ExerciseTab() {
  const [answers, setAnswers] = useState({});
  const [results, setResults] = useState({});

  function setAnswer(id, value) {
    setAnswers(a => ({...a, [id]: value}));
  }

  function checkExercise(id) {
    let ok = false;
    let expected = null;
    switch(id) {
      case 1: { // 5^x ≡ 8 (mod 23)
        expected = discreteLogBruteforce(5, 8, 23);
        ok = String(answers[id]).trim() === String(expected);
        break;
      }
      case 2: { // list 2^1..2^10 mod29
        const vals = [];
        for (let x=1;x<=10;x++) vals.push(modPow(2,x,29));
        expected = vals.join(',');
        const got = String(answers[id]||'').replace(/\s+/g,'');
        ok = got === expected.replace(/\s+/g,'');
        break;
      }
      case 4: { // check generator for p=31 g=3
        const p=31, g=3; const phi = p-1;
        const primeFactors = [2,3,5];
        let isGen = true;
        for (const q of primeFactors) if (modPow(g, phi/q, p) === 1) isGen = false;
        expected = isGen ? 'yes' : 'no';
        const got = String(answers[id]||'').toLowerCase().trim();
        ok = (got === expected || got === (expected==='yes'?'true':'false'));
        break;
      }
      case 5: { // 7^x ≡ 11 (mod41)
        expected = discreteLogBruteforce(7,11,41);
        ok = String(answers[id]).trim() === String(expected);
        break;
      }
      case 6: { // DH example: compute A,B,K
        const p=23,g=5,a=6,b=15;
        const A = modPow(g,a,p); const B = modPow(g,b,p); const K = modPow(B,a,p);
        expected = `A=${A},B=${B},K=${K}`;
        const got = String(answers[id]||'').replace(/\s+/g,'');
        ok = got === expected.replace(/\s+/g,'');
        break;
      }
      case 9: { // p=47,g=2,A=18 find a, then K with b=9
        const p=47,g=2,A=18,b=9; const a = discreteLogBruteforce(g,A,p);
        const K = a === null ? null : modPow(A, b, p);
        expected = `a=${a},K=${K}`;
        const got = String(answers[id]||'').replace(/\s+/g,'');
        ok = got === expected.replace(/\s+/g,'');
        break;
      }
      default: {
        // no auto-check
        expected = null;
        ok = false;
      }
    }
    setResults(r => ({...r, [id]: { ok, expected }}));
  }
  return (
    <PageLayout title="🏷️ Bài tập học thuật">
      <Card>
        <div className="prose max-w-none">

      <Section title="A. Discrete Logarithm – Bài tập học thuật">

        <Exercise>
          <b>Bài 1.</b> Cho p = 23, g = 5. Tìm x sao cho:
          <Formula inline>5^x ≡ 8 (mod 23)</Formula>
          <i>Gợi ý:</i> Thử lần lượt x = 1,2,3,...
          <div className="mt-2 form-row">
            <input value={answers[1]||''} onChange={e=>setAnswer(1,e.target.value)} placeholder="Nhập x" />
            <button className="btn btn-accent" onClick={()=>checkExercise(1)}>Check</button>
            {results[1] && <Result label={results[1].ok ? 'Đúng' : 'Sai'} value={results[1].ok ? '✓' : (results[1].expected ?? '—')} highlight={results[1].ok} />}
          </div>
        </Exercise>

        <Exercise>
          <b>Bài 2.</b> Với p = 29, g = 2. Tính giá trị của:
          <Formula inline>2^x mod 29</Formula>
          với x = 1 → 10. Nhận xét chu kỳ.
          <div className="mt-2 form-row">
            <input value={answers[2]||''} onChange={e=>setAnswer(2,e.target.value)} placeholder="vd: 2,4,8,..." />
            <button className="btn btn-accent" onClick={()=>checkExercise(2)}>Check</button>
            {results[2] && <Result label={results[2].ok ? 'Đúng' : 'Sai'} value={results[2].ok ? '✓' : (results[2].expected ?? '—')} highlight={results[2].ok} />}
          </div>
        </Exercise>

        <Exercise>
          <b>Bài 3.</b> Chứng minh rằng nếu gcd(g, p) ≠ 1 thì bài toán Discrete Log không xác định.
        </Exercise>

        <Exercise>
          <b>Bài 4.</b> Cho p = 31, g = 3. Kiểm tra xem g có phải là phần tử sinh không.
          <div className="mt-2 form-row">
            <input value={answers[4]||''} onChange={e=>setAnswer(4,e.target.value)} placeholder="yes/no" />
            <button className="btn btn-accent" onClick={()=>checkExercise(4)}>Check</button>
            {results[4] && <Result label={results[4].ok ? 'Đúng' : 'Sai'} value={results[4].ok ? '✓' : (results[4].expected ?? '—')} highlight={results[4].ok} />}
          </div>
        </Exercise>

        <Exercise>
          <b>Bài 5.</b> Giải Discrete Log bằng brute-force:
          <Formula inline>7^x ≡ 11 (mod 41)</Formula>
          và ước lượng độ phức tạp.
          <div className="mt-2 form-row">
            <input value={answers[5]||''} onChange={e=>setAnswer(5,e.target.value)} placeholder="Nhập x nếu tìm được" />
            <button className="btn btn-accent" onClick={()=>checkExercise(5)}>Check</button>
            {results[5] && <Result label={results[5].ok ? 'Đúng' : 'Sai'} value={results[5].ok ? '✓' : (results[5].expected ?? '—')} highlight={results[5].ok} />}
          </div>
        </Exercise>

      </Section>

      <Section title="B. Diffie–Hellman – Bài tập học thuật">

        <Exercise>
          <b>Bài 6.</b> Cho p = 23, g = 5. Alice chọn a = 6, Bob chọn b = 15.
          <ul className="list-disc ml-6">
            <li>Tính A, B</li>
            <li>Tính khóa chung K</li>
          </ul>
          <div className="mt-2 form-row">
            <input value={answers[6]||''} onChange={e=>setAnswer(6,e.target.value)} placeholder="Nhập: A=...,B=...,K=..." />
            <button className="btn btn-accent" onClick={()=>checkExercise(6)}>Check</button>
            {results[6] && <Result label={results[6].ok ? 'Đúng' : 'Sai'} value={results[6].ok ? '✓' : (results[6].expected ?? '—')} highlight={results[6].ok} />}
          </div>
        </Exercise>

        <Exercise>
          <b>Bài 7.</b> Giả sử kẻ tấn công biết p, g, A.
          <br/>Hãy mô tả cách phá Diffie–Hellman nếu p nhỏ.
        </Exercise>

        <Exercise>
          <b>Bài 8.</b> Vì sao Diffie–Hellman không tự cung cấp xác thực (authentication)?
        </Exercise>

        <Exercise>
          <b>Bài 9.</b> Cho p = 47, g = 2. Alice gửi A = 18.
          <br/>Tìm a bằng Discrete Log và tính khóa chung nếu Bob dùng b = 9.
          <div className="mt-2 form-row">
            <input value={answers[9]||''} onChange={e=>setAnswer(9,e.target.value)} placeholder="Nhập: a=...,K=..." />
            <button className="btn btn-accent" onClick={()=>checkExercise(9)}>Check</button>
            {results[9] && <Result label={results[9].ok ? 'Đúng' : 'Sai'} value={results[9].ok ? '✓' : (results[9].expected ?? '—')} highlight={results[9].ok} />}
          </div>
        </Exercise>

        <Exercise>
          <b>Bài 10.</b> Phân tích tại sao việc tái sử dụng số mũ bí mật (a hoặc b)
          trong Diffie–Hellman là nguy hiểm.
        </Exercise>

      </Section>

      <Section title="📌 Ghi chú">
        <p>
          Các bài tập trên được thiết kế theo phong cách học thuật và tương tự
          hệ thống bài tập của <b>CryptoHack</b>. Sinh viên nên tự giải tay
          trước khi dùng tab <i>Công cụ mã hóa</i>.
        </p>
      </Section>

        </div>
      </Card>
    </PageLayout>
  );
}
