import { useState, useEffect } from "react";
import axios from "axios";

export default function BankForm({ userId }: { userId: number }) {
  const [account, setAccount] = useState("");
  const [token, setToken] = useState<string | null>(null);
  const [status, setStatus] = useState("");
  const [linkedBanks, setLinkedBanks] = useState<any[]>([]);

  // Load danh sách ngân hàng liên kết khi component mount
  useEffect(() => {
    const fetchLinkedBanks = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/api/bank/list/${userId}`);
        setLinkedBanks(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    if (userId) fetchLinkedBanks();
  }, [userId]);

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
    if (!token) return;
    try {
      await axios.post("http://localhost:8080/api/bank/confirm", { token });
      setStatus("✅ Ngân hàng đã được xác nhận!");
      setToken(null);

      // Cập nhật danh sách ngân hàng sau khi confirm
      const res = await axios.get(`http://localhost:8080/api/bank/list/${userId}`);
      setLinkedBanks(res.data);
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
        style={{ padding: "6px", marginRight: "8px" }}
      />
      <button onClick={handleLink} style={{ marginRight: "8px" }}>
        Liên kết
      </button>
      <button onClick={handleConfirm} disabled={!token}>
        Xác nhận
      </button>

      {status && (
        <p style={{ marginTop: "5px", color: status.startsWith("❌") ? "red" : "green" }}>
          {status}
        </p>
      )}

      <h4 style={{ marginTop: "15px" }}>Tài khoản đã liên kết:</h4>
      {linkedBanks.length === 0 && <p>Chưa có tài khoản nào liên kết</p>}
        <ul>
          {linkedBanks.map((bank) => (
            <li key={bank.id}>
              {bank.account_number} - {bank.bank_name}
            </li>
          ))}
        </ul>
    </div>
  );
}
