import { useLocation } from "react-router-dom";

export const useCurrentPage = () => {
  const location = useLocation();
  const path = location.pathname;

  let title = "Bosh sahifa";

  if (path === "/dashboard") title = "Asosiy";
  else if (path === "/firms") title = "Barcha Firmalar";
  else if (path.startsWith("/firms/")) title = "Firma ma'lumotlari";
  else if (path === "/transactions") title = "Transactions";
  else if (path === "/calendar") title = "Statistika";
  else if (path === "/profile/edit") title = "Profilni tahrirlash";
  else if (path === "/profile") title = "Profil";

  return { title, path };
};
