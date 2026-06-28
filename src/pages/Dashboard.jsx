import { useEffect, useState } from "react";
import { useAuthStore } from "../store/authStore";
import { getFirms } from "../services/firm.service";

import { Card, CardTitle } from "@/components/ui/card";
import { logoutUser } from "@/services/auth.service";
import { Search, User } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Link } from "react-router-dom";

const DashboardPage = () => {
  const [firms, setFirms] = useState([]);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    if (!user?.uid) return;

    const loadDashboard = async () => {
      const firmsData = await getFirms(user.uid);
      setFirms(firmsData);
    };

    loadDashboard();
  }, [user?.uid]);

  const totalDebt = firms.reduce((sum, firm) => sum + (firm.balance || 0), 0);
  const totalPayment = firms.reduce(
    (sum, firm) => sum + (firm.totalPayment || 0),
    0,
  );
  const totalPaymentPercent = (totalPayment / totalDebt) * 100;

  const getInitials = (name) => {
    const w = name.trim().split(/\s+/);
    return w
      .slice(0, w.length >= 3 ? 2 : w.length)
      .map((x) => x[0].toUpperCase())
      .join("");
  };

  const capitalize = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  const handleLogout = async () => {
    await logoutUser();
  };

  return (
    <Container>
      <div className="flex items-center justify-between py-5">
        <div>
          <p className="text-[10px] font-semibold">FINANCIAL</p>
          <h2 className="text-2xl font-bold">DeptFlow</h2>
        </div>
        <Link
          to="/profile"
          className="bg-gray-400 w-9 h-9 flex items-center justify-center rounded-full"
        >
          <User className="w-5" />
        </Link>
      </div>

      <Card className={"px-4"}>
        <p className="text-[10px] font-semibold">UMUMIY QARZ</p>
        <p className="text-3xl font-bold pb-3">
          {totalDebt.toLocaleString("fr-FR")}
        </p>
        <div className="flex justify-between items-center">
          <div>
            <p className="text-[10px]">Firmalar</p>
            <p className="text-[10px] font-bold">{firms.length} ta</p>
          </div>
          <div className="flex flex-col items-end">
            <p className="text-[10px]">To'langan</p>
            <p className="text-[10px] font-bold">
              {Math.floor(totalPaymentPercent)?.toLocaleString("fr-FR")} %
            </p>
          </div>
        </div>
      </Card>

      <div className="flex items-center gap-3 border px-3 py-2 rounded-3xl mt-10 mb-7 shadow-sm">
        <Search className="w-5 text-gray-500" />
        <input type="text" placeholder="Search..." />
      </div>

      <div className="flex justify-between items-center mb-3 font-semibold">
        <p>Firmalar ro'yxati</p>
        <Link to="/firms" className="text-blue-500 text-[12px]">
          Hammasi
        </Link>
      </div>

      <div className="flex flex-col gap-3">
        {firms?.map((item) => (
          <Card
            key={item.id}
            className={"flex justify-between gap-3 w-full px-5 py-4"}
          >
            <div className="w-10 h-10 rounded-[15px] bg-gray-200 flex items-center justify-center text-xl font-semibold">
              {getInitials(item.name)}
            </div>
            <div className="flex flex-1 justify-between items-center">
              <div>
                <CardTitle className={"font-bold"}>
                  {capitalize(item.name)}
                </CardTitle>
                <p className="text-[10px]">
                  {item.updatedAt.toDate().toLocaleDateString()}
                </p>
              </div>
              <div className="flex flex-col items-end">
                <p className="text-[18px] font-semibold">{item.balance}</p>
                <p className="text-[10px]">
                  {Math.floor((item.balance / item.totalPurchase) * 100)}%
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>
      <button onClick={handleLogout}>Logout</button>
      <div className="h-15.5"></div>
    </Container>
  );
};

export default DashboardPage;
