import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

import { getAllTransactions } from "../services/transaction.service";
import { useAuthStore } from "../store/authStore";

const CalendarPage = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [transactions, setTransactions] = useState([]);

  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    if (!user) return;

    const loadTransactions = async () => {
      const data = await getAllTransactions(user.uid);

      setTransactions(data);
    };

    loadTransactions();
  }, [user]);

  const dailyTransactions = transactions.filter((tx) => {
    const date = tx.createdAt?.toDate();

    return date && date.toDateString() === selectedDate.toDateString();
  });

  const dayPurchase = dailyTransactions
    .filter((tx) => tx.type === "purchase")
    .reduce((sum, tx) => sum + tx.amount, 0);

  const dayPayment = dailyTransactions
    .filter((tx) => tx.type === "payment")
    .reduce((sum, tx) => sum + tx.amount, 0);

  return (
    <div>
      <Calendar onChange={setSelectedDate} value={selectedDate} />

      <h3>Tanlangan sana:</h3>

      <h2>{selectedDate.toLocaleDateString()}</h2>

      {dailyTransactions.map((tx) => (
        <div
          key={tx.id}
          style={{
            border: "1px solid #ddd",
            marginBottom: "10px",
            padding: "10px",
          }}
        >
          <h4>{tx.firmName}</h4>

          <p>
            {tx.type === "purchase" ? "📦 Tovar olindi" : "💰 To'lov qilindi"}
          </p>

          <p>{tx.amount.toLocaleString()} so'm</p>

          <p>{tx.note}</p>
        </div>
      ))}
      <p>
        Olingan:
        {dayPurchase.toLocaleString()} so'm
      </p>

      <p>
        To'langan:
        {dayPayment.toLocaleString()} so'm
      </p>
    </div>
  );
};

export default CalendarPage;
