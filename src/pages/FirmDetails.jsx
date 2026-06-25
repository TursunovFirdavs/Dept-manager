import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { useAuthStore } from "../store/authStore";

import { getFirmById } from "../services/firm.service";
import { addPurchase, addPayment } from "../services/transaction.service";
import { getTransactions } from "../services/transaction.service";

const FirmDetails = () => {
  const { firmId } = useParams();

  const user = useAuthStore((state) => state.user);

  const [firm, setFirm] = useState(null);
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [transactions, setTransactions] = useState([]);

  const loadData = async () => {
    const [firmData, txData] = await Promise.all([
      getFirmById(user.uid, firmId),
      getTransactions(user.uid, firmId),
    ]);

    setFirm(firmData);
    setTransactions(txData);
  };

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      await loadData();
    };

    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, firmId]);

  if (!firm) {
    return <h2>Loading...</h2>;
  }

  const handlePurchase = async () => {
    if (!amount) return;

    await addPurchase(user.uid, firmId, firm.name, Number(amount), note);

    await loadData();

    setAmount("");
    setNote("");
  };

  const handlePayment = async () => {
    if (!amount) return;

    await addPayment(user.uid, firmId, firm.name, Number(amount), note);

    await loadData();

    setAmount("");
    setNote("");
  };
  console.log("firm", firm);

  return (
    <div>
      <h1>{firm.name}</h1>

      <h3>Qarz: {firm.balance}</h3>

      <p>Jami tovar: {firm.totalPurchase}</p>

      <p>Jami to'lov: {firm.totalPayment}</p>

      <input
        type="number"
        placeholder="Summa"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      <input
        placeholder="Izoh"
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />

      <button onClick={handlePurchase}>Tovar oldim</button>

      <button onClick={handlePayment}>To'lov qildim</button>

      <h2>Tarix</h2>

      {transactions.map((tx) => (
        <div
          key={tx.id}
          style={{
            border: "1px solid #ddd",
            padding: "10px",
            marginBottom: "10px",
          }}
        >
          <p>
            {tx.type === "purchase" ? "📦 Tovar olindi" : "💰 To'lov qilindi"}
          </p>

          <p>Summa: {tx.amount}</p>

          <p>Izoh: {tx.note}</p>
        </div>
      ))}
    </div>
  );
};

export default FirmDetails;
