import { useState } from "react";
import axios from "axios";

interface BankFormProps {
  userId: number;
}

export default function BankForm({ userId }: BankFormProps) {
  const [account, setAccount] = useState("");
  const [token, setToken] = useState("");
  const [status, setStatus] = useState("");

  const handleLink = async () => {
    try {
      const res = await axios.post("http://localhost:8080/api/bank/link", {
        userId,
        accountNumber: account,
      });
      setToken(res.data.token);
      setStatus("Đã tạo liên kết, chờ xác nhận");
    } catch (err) {
      console.error(err);
      setStatus("❌ Lỗi khi liên kết ngân hàng");
    }
  };

  const handleConfirm = async () => {
    try {
      await axios.post("http://localhost:8080/api/bank/confirm", { token });
      setStatus("✅ Ngân hàng đã được xác nhận!");
    } catch (err) {
      console.error(err);
      setStatus("❌ Xác nhận thất bại");
    }
  };

  return (
    <div style={{ padding: "1rem", border: "1px solid #ccc", borderRadius: "8px" }}>
      <h3>Liên kết Vietcombank</h3>
      <input
        type="text"
        value={account}
        onChange={(e) => setAccount(e.target.value)}
        placeholder="Nhập số tài khoản"
      />
      <button onClick={handleLink}>Liên kết</button>
      <button onClick={handleConfirm} disabled={!token}>
        Xác nhận
      </button>
      {token && <p><strong>Token:</strong> {token}</p>}
      {status && <p style={{ color: status.startsWith("❌") ? "red" : "green" }}>{status}</p>}
    </div>
  );
}
