import { startServer } from "./server";
import { startEmailWorker } from "./workers/email.worker";
import { startNotificationWorker } from "./workers/notification.worker";

let server: any;

//Démarrage du serveur et des workers
async function startAll() {
  console.log("Démarrage de tous les services du backend...");
  server = startServer();
  try {
    startEmailWorker();
  } catch (err) {
    console.error("Erreur lors du démarrage du worker d'emails", err);
  }

  try {
    startNotificationWorker();
  } catch (err) {
    console.error("Erreur lors du démarrage du worker de notifications", err);
  }
}

startAll();

//Fonction d'arret
async function shutdown(signal: string) {
  console.log(`${signal} signal. Arret...`);

  try {
    if (server) {
      server.close(() => {
        console.log("HTTP serveur arreté.");
      });
    }
    process.exit(0);
  } catch (err) {
    console.error("Erreur de fermeture du serveur:", err);
    process.exit(1);
  }
}

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
