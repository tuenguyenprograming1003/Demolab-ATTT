# Diffie–Hellman Key Exchange

## 1. Giới thiệu
**Diffie–Hellman (DH)** là thuật toán trao đổi khóa giúp hai bên tạo **khóa bí mật chung**
qua kênh công khai.

---

## 2. Ý tưởng cốt lõi
- Làm việc trong **nhóm modulo p**
- Dựa trên độ khó của **Discrete Logarithm Problem**

> Biết \( g^a \mod p \) rất dễ  
> Nhưng tìm lại \( a \) là **rất khó**

---

## 3. Các bước thuật toán
1. Hai bên thống nhất số nguyên tố lớn **p**
2. Chọn phần tử sinh **g**
3. Alice chọn số bí mật **a**
4. Bob chọn số bí mật **b**
5. Trao đổi:
   - A = g^a mod p
   - B = g^b mod p
6. Khóa chung:
   - K = B^a mod p = A^b mod p

---

## 4. Ứng dụng
- TLS / HTTPS
- VPN
- Blockchain
- Secure Messaging

---

## 5. Tài liệu tham khảo
- https://cryptohack.org/challenges/diffie-hellman/
- NIST SP 800-56A
- Menezes, *Handbook of Applied Cryptography*
