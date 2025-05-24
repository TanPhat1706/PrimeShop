import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

const PaymentResult = () => {
  const [searchParams] = useSearchParams();
  const status = searchParams.get("status"); // Đây sẽ là "00" nếu thanh toán thành công
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (status === "00") {
      setMessage("Thanh toán thành công 🎉");
    } else {
      setMessage("Thanh toán thất bại ❌");
    }
  }, [status]);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h2 className="text-2xl font-bold">{message}</h2>
      <a href="/" className="mt-4 text-blue-500 underline">Quay về trang chủ</a>
    </div>
  );
};

export default PaymentResult;
