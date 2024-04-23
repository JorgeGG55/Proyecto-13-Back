const deleteExpiredLoans = require("../api/controllers/loan");

const scheduleDailyCleanup = () => {
  const now = new Date();
  const cleanupTime = new Date(now);
  cleanupTime.setHours(24, 0, 0, 0);
  /*console.log(
    `Programación de limpieza diaria para ${cleanupTime.toLocaleDateString()} a las ${cleanupTime.toLocaleTimeString()}`
  );*/
  let timeUntilCleanup = cleanupTime - now;
  if (timeUntilCleanup < 0) {
    cleanupTime.setDate(cleanupTime.getDate() + 1);
    timeUntilCleanup = cleanupTime - now;
  }

  setTimeout(async () => {
    try {
      await deleteExpiredLoans.deleteExpiredLoans();
    } catch (error) {
      console.error("Error al limpiar préstamos vencidos:", error);
    }
    scheduleDailyCleanup();
  }, timeUntilCleanup);
};

module.exports = { scheduleDailyCleanup };
