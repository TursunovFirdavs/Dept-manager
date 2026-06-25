import { useEffect, useState } from "react";
import { logoutUser } from "../services/auth.service";
import { getAllTransactions } from "../services/transaction.service";
import { useAuthStore } from "../store/authStore";
import { getFirms } from "../services/firm.service";

import { Link } from "react-router-dom";

const DashboardPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [firms, setFirms] = useState([]);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    const loadDashboard = async () => {
      const transactions = await getAllTransactions(user.uid);
      const firmsData = await getFirms(user.uid);

      setTransactions(transactions);
      setFirms(firmsData);
    };

    loadDashboard();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogout = async () => {
    await logoutUser();
  };

  const totalPurchase = transactions
    .filter((tx) => tx.type === "purchase")
    .reduce((sum, tx) => sum + tx.amount, 0);

  const totalPayment = transactions
    .filter((tx) => tx.type === "payment")
    .reduce((sum, tx) => sum + tx.amount, 0);

  const totalDebt = firms.reduce((sum, firm) => sum + (firm.balance || 0), 0);

  // filters
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

  const userData = useAuthStore((state) => state.userData);

  console.log("userData", userData);

  return (
    <div>
      <h1>Dashboard</h1>

      <p>{user?.email}</p>
      <button onClick={handleLogout}>Chiqish</button>
      <Link to="/firms">Firmalar</Link>

      <h2>Statistika</h2>
      <p>Jami firmalar: {firms.length}</p>

      <p>
        Jami olingan:
        {totalPurchase}
      </p>

      <p>
        Jami to'langan:
        {totalPayment}
      </p>

      <p>
        Jami qarz:
        {totalDebt}
      </p>

      <h2>Oxirgi transactionlar</h2>

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

export default DashboardPage;
