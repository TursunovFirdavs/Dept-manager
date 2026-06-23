import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { useAuthStore } from "../store/authStore";

import { createFirm, getFirms } from "../services/firm.service";

const FirmsPage = () => {
  const user = useAuthStore((state) => state.user);

  const [name, setName] = useState("");

  const [firms, setFirms] = useState([]);

  const loadFirms = async () => {
    const data = await getFirms(user.uid);

    setFirms(data);
  };

  useEffect(() => {
    const loadData = async () => {
      if (!user) return;

      try {
        const data = await getFirms(user.uid);
        setFirms(data);
      } catch (error) {
        console.error(error);
      }
    };

    loadData();
  }, [user]);

  const handleCreate = async () => {
    if (!name.trim()) return;

    await createFirm(user.uid, { name });

    setName("");

    loadFirms();
  };

  return (
    <div>
      <h1>Firmalar</h1>

      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Firma nomi"
      />

      <button onClick={handleCreate}>Qo'shish</button>

      <hr />

      {firms.map((firm) => (
        <Link key={firm.id} to={`/firms/${firm.id}`}>
          <h3>{firm.name}</h3>
        </Link>
      ))}
    </div>
  );
};

export default FirmsPage;
