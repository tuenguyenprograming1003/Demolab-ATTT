import React from 'react';
import { Section, Formula } from '../components/UI';
import { modPow } from '../crypto/diffieHellman';

export default function TheoryTab(){
  return (
    <div className="space-y-6 max-w-4xl">
      <Section title="Diffie–Hellman basics">
        <p>
          Diffie–Hellman (DH) là một giao thức trao đổi khóa công khai cho phép hai bên (Alice và Bob) tạo một khóa bí mật chung mà không cần gửi trực tiếp khóa đó qua mạng.
        </p>
        <ol className="mt-2 list-decimal ml-5 space-y-1 text-sm text-slate-700">
          <li>Hai bên đồng ý một số nguyên tố p và một generator g (công khai).</li>
          <li>Alice chọn bí mật a và gửi <Formula inline>A = g^a mod p</Formula> cho Bob.</li>
          <li>Bob chọn bí mật b và gửi <Formula inline>B = g^b mod p</Formula> cho Alice.</li>
          <li>Alice tính khóa chung <Formula inline>K = B^a mod p</Formula>; Bob tính <Formula inline>K = A^b mod p</Formula>. Cả hai thu được cùng một K.</li>
        </ol>
        <p className="mt-2 text-sm text-slate-600">
          Ký hiệu cơ bản: <Formula>g^x ≡ y (mod p)</Formula>
        </p>
      </Section>

      <Section title="Security and discrete logarithm">
        <p>
          Bảo mật của DH dựa trên giả thuyết rằng bài toán log rời rạc (Discrete Log) là khó khi p đủ lớn và g được chọn hợp lý. Bài toán: cho g, p, và A = g^x mod p, tìm x.
        </p>
        <p className="mt-2 text-sm text-slate-600">
          Với p nhỏ, ta có thể dò tìm x bằng tấn công brute-force hoặc thuật toán baby-step giant-step — công cụ minh họa trên trang này trình bày tấn công đơn giản (brute-force) để minh họa vì sao p phải lớn.
        </p>
      </Section>

      <Section title="Protocol example (numbers)">
        <p className="text-sm text-slate-700">
          Ví dụ minh họa với p = 467, g = 2, a = 123, b = 77. Ta tính A và B, sau đó khóa chung K:
        </p>
        <div className="mt-3 p-3 bg-slate-50 rounded border">
          <div className="text-sm">p = <strong>467</strong>, g = <strong>2</strong></div>
          <div className="text-sm">A = g^a mod p = <strong>{modPow(2, 123, 467)}</strong></div>
          <div className="text-sm">B = g^b mod p = <strong>{modPow(2, 77, 467)}</strong></div>
          <div className="text-sm mt-1">Shared K = B^a mod p = <strong>{modPow(modPow(2,77,467),123,467)}</strong></div>
        </div>
      </Section>

      <Section title="Practical notes">
        <ul className="mt-2 list-disc ml-5 text-sm text-slate-700 space-y-1">
          <li>Trong thực tế, các giá trị p thường là số nguyên tố lớn (2048-bit hoặc hơn) và sử dụng nhóm thích hợp (ví dụ, nhóm elip) để tăng độ an toàn.</li>
          <li>Generator g phải được chọn sao cho chu kỳ đủ lớn; tránh các g có chu kỳ nhỏ.</li>
          <li>Để bảo vệ chống lại tấn công trung gian (MITM), cần kết hợp DH với cơ chế xác thực (ví dụ, sử dụng chữ ký số hoặc TLS).</li>
        </ul>
      </Section>
    </div>
  );
}
