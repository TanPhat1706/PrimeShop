import React from "react";
import BankForm from "../../components/BankForm";

export default function BankPage() {

  const user = JSON.parse(localStorage.getItem("user") || "null");
  const userId = user?.id;

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Liên kết ngân hàng</h2>
      {userId ? (
        <BankForm userId={userId} />
      ) : (
        <p style={{ color: "red" }}>⚠️ Bạn cần đăng nhập để liên kết ngân hàng</p>
      )}
    </div>
  );
}
