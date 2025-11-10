import { Server } from "socket.io";
import http from "http";
import { Message } from "../message/Message";

//Instance du serveur Socket.io
let io: Server;

/**
 * Initialise et configure le serveur Socket.IO pour gérer la communication en temps réel
 * Cet utilitaire crée une instance de Socket.IO liée au serveur HTTP fourni,
 * puis configure les événements côté serveur pour la gestion des conversations :
 * - Connexion et déconnexion des clients
 * - Jointure d’une conversation (room)
 * - Envoi, modification, suppression et lecture de messages
 * @param server - Instance du serveur HTTP Node.js sur laquelle Socket.IO sera attaché
 * @returns L’instance initialisée de Socket.IO
 */
export const setupSocket = (server: http.Server) => {
  io = new Server(server, {
    cors: { origin: "*" },
  });

  io.on("connection", (socket) => {
    console.log("🟢 Client connecté:", socket.id);

    /**
     * Le client rejoint une conversation spécifique.
     * Chaque conversation est représentée par une "room" Socket.IO
     * permettant d’envoyer des messages uniquement aux participants.
     */
    socket.on("join_conversation", (conversationId:string) => {
      socket.join(conversationId);
      console.log("Le client a joint la conversation : ", conversationId);
    });

    /**
     * Réception d’un message envoyé par un client.
     * Le serveur diffuse ensuite ce message à tous les utilisateurs
     * connectés à la même conversation.
     */
    socket.on("send_message", (message:Message) => {
      io.to(message.conversationId).emit("new_message", message);
      console.log("Nouveau message : ", message);
    });

    /**
     * Lorsqu’un message est modifié par un utilisateur,
     * le serveur notifie tous les membres de la conversation.
     */
    socket.on("edit_message", (message:Message) => {
      io.to(message.conversationId).emit("message_edited", message);
      console.log("Message modifié : ", message)
    });

    /**
     * Lorsqu’un message est marqué comme lu, une notification est émise
     * à tous les utilisateurs de la conversation.
     */
    socket.on("message_read", ({ conversationId, messageId, userId }) => {
      io.to(conversationId).emit("message_read", { messageId, userId });
      console.log("Message lu", messageId);
    });

    /**
     * Lorsqu’un message est supprimé, l’événement est diffusé à tous les clients.
     */
    socket.on("delete_message", (messageId) => {
      io.emit("message_deleted", messageId);
      console.log("Message supprimé", messageId);
    });

    /**
     * Gestion de la déconnexion d’un client.
     */
    socket.on("disconnect", () => {
      console.log("🔴 Client déconnecté:", socket.id);
    });
  });

  return io;
};

/**
 * Retourne l’instance actuelle du serveur Socket.IO.
 * Cette fonction est utile pour accéder à l’objet `io` depuis d’autres modules
 * (ex. dans un service ou un contrôleur), sans devoir réinitialiser Socket.IO.
 * @returns L’instance actuelle de Socket.IO
 * @throws {Error} Si Socket.IO n’a pas encore été initialisé via `setupSocket()`
 */
export const getIO = (): Server => {
  if (!io) {
    throw new Error("Socket.io n'est pas initialisé !");
  }
  return io;
};