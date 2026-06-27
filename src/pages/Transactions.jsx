import { getAllTransactions } from "@/services/transaction.service";
import { useAuthStore } from "@/store/authStore";
import { useEffect, useState } from "react";

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    const loadData = async () => {
      const transactions = await getAllTransactions(user.uid);

      setTransactions(transactions);
    };

    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const today = new Date();

  const todayPurchase = transactions
    .filter((tx) => {
      if (tx.type !== "purchase") return false;

      const date = tx.createdAt?.toDate();

      return date && date.toDateString() === today.toDateString();
    })
    .reduce((sum, tx) => sum + tx.amount, 0);

  const todayPayment = transactions
    .filter((tx) => {
      if (tx.type !== "payment") return false;

      const date = tx.createdAt?.toDate();

      return date && date.toDateString() === today.toDateString();
    })
    .reduce((sum, tx) => sum + tx.amount, 0);

  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  const monthPurchase = transactions
    .filter((tx) => {
      if (tx.type !== "purchase") return false;

      const date = tx.createdAt?.toDate();

      return (
        date &&
        date.getMonth() === currentMonth &&
        date.getFullYear() === currentYear
      );
    })
    .reduce((sum, tx) => sum + tx.amount, 0);

  const monthPayment = transactions
    .filter((tx) => {
      if (tx.type !== "payment") return false;

      const date = tx.createdAt?.toDate();

      return (
        date &&
        date.getMonth() === currentMonth &&
        date.getFullYear() === currentYear
      );
    })
    .reduce((sum, tx) => sum + tx.amount, 0);

  const yearPurchase = transactions
    .filter((tx) => {
      if (tx.type !== "purchase") return false;

      const date = tx.createdAt?.toDate();

      return date && date.getFullYear() === currentYear;
    })
    .reduce((sum, tx) => sum + tx.amount, 0);

  const yearPayment = transactions
    .filter((tx) => {
      if (tx.type !== "payment") return false;

      const date = tx.createdAt?.toDate();

      return date && date.getFullYear() === currentYear;
    })
    .reduce((sum, tx) => sum + tx.amount, 0);
  return (
    <div>
      {transactions.map((tx) => (
        <div
          key={tx.id}
          style={{
            border: "1px solid #ddd",
            padding: "10px",
            marginBottom: "10px",
          }}
        >
          <h4>{tx.firmName}</h4>

          <p>
            {tx.type === "purchase" ? "📦 Tovar olindi" : "💰 To'lov qilindi"}
          </p>

          <p>Summa: {tx.amount}</p>

          <p>Izoh: {tx.note}</p>
        </div>
      ))}

      <h2>Bugungi statistika</h2>

      <p>
        Olingan:
        {todayPurchase.toLocaleString()} so'm
      </p>

      <p>
        To'langan:
        {todayPayment.toLocaleString()} so'm
      </p>

      <hr />

      <h2>Oylik statistika</h2>

      <p>
        Olingan:
        {monthPurchase.toLocaleString()} so'm
      </p>

      <p>
        To'langan:
        {monthPayment.toLocaleString()} so'm
      </p>

      <hr />

      <h2>Yillik statistika</h2>

      <p>
        Olingan:
        {yearPurchase.toLocaleString()} so'm
      </p>

      <p>
        To'langan:
        {yearPayment.toLocaleString()} so'm
      </p>
    </div>
  );
};

export default Transactions;
