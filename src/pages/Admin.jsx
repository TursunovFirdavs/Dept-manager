import { useEffect, useState } from "react";

import {
  getUsers,
  updateSubscriptionDate,
  updateSubscriptionStatus,
  updateUserStatus,
} from "../services/user.service";

const Admin = () => {
  const [users, setUsers] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");

  useEffect(() => {
    const loadUsers = async () => {
      const data = await getUsers();

      setUsers(data);
    };

    loadUsers();
  }, []);

  const handleStatusChange = async (uid, status) => {
    await updateUserStatus(uid, status);

    const data = await getUsers();

    setUsers(data);
  };

  const handleSubscriptionChange = async (uid, status) => {
    await updateSubscriptionStatus(uid, status);

    const data = await getUsers();

    setUsers(data);
  };

  const handleSubscriptionDateChange = async (uid) => {
    await updateSubscriptionDate(uid, selectedDate);

    const data = await getUsers();

    setUsers(data);
  };
  console.log(users);

  return (
    <div>
      <h1>Admin Dashboard</h1>

      <h2>Foydalanuvchilar</h2>

      {users.map((user) => (
        <div
          key={user.id}
          style={{
            border: "1px solid #ddd",
            padding: "10px",
            marginBottom: "10px",
          }}
        >
          <p>UID: {user.uid}</p>

          <p>Role: {user.role}</p>

          <p>Status: {user.status}</p>

          <p>
            Plan:
            {user.subscription?.plan}
          </p>

          <p>Subscription: {user.subscription?.status}</p>

          <p>
            Do'kon:
            {user.shopName || "-"}
          </p>
          <button
            onClick={() =>
              handleStatusChange(
                user.id,
                user.status === "active" ? "blocked" : "active",
              )
            }
          >
            {user.status === "active" ? "Block" : "Unblock"}
          </button>
          <button
            onClick={() =>
              handleSubscriptionChange(
                user.id,
                user.subscription?.status === "active" ? "expired" : "active",
              )
            }
          >
            {user.subscription?.status === "active" ? "Expire" : "Activate"}
          </button>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
          <button onClick={() => handleSubscriptionDateChange(user.id)}>
            change subscribe
          </button>
        </div>
      ))}
    </div>
  );
};

export default Admin;
