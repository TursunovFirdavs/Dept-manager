export const calculateStats = (transactions) => {
  //   const today = new Date();

  //   const currentMonth = today.getMonth();

  //   const currentYear = today.getFullYear();

  const totalPurchase = transactions
    .filter((tx) => tx.type === "purchase")
    .reduce((sum, tx) => sum + tx.amount, 0);

  const totalPayment = transactions
    .filter((tx) => tx.type === "payment")
    .reduce((sum, tx) => sum + tx.amount, 0);

  return {
    totalPurchase,
    totalPayment,
  };
};
