import { Server } from "socket.io";
import http from "http";
import { Message } from "../message/Message";
import { getUserTeams } from "../user/user.services";
import { getUserConversations } from "../user/user.services";
import { verifyToken } from "../auth/utils/jwt";
import { tokenPayloadSchema } from "../auth/auth.schemas";
import cookie from "cookie";
import { redis } from "../types/Redis";

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
    cors: {
      origin: "https://projectmanager-wb93.onrender.com",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", async (socket) => {
    try {
      console.log("🟢 Client connecté:", socket.id);
      const rawcookies = socket.request.headers?.cookie;
      if (!rawcookies) {
        console.log("No cookie found in socket handshake");
        return;
      }
      const cookies = cookie.parse(rawcookies || "");
      const token = cookies["projectFlowToken"];

      if (!token) {
        socket.disconnect();
        return;
      }

      const payLoad = tokenPayloadSchema.parse(verifyToken(token));
      socket.userId = payLoad.sub;
      console.log(`🔌 User connected: ${socket.userId} (socket: ${socket.id})`);

      const key = `user:${socket.userId}:connections`;
      await redis.sadd(key, socket.id);

      // Optionnel : éviter les connexions zombies
      //await redis.expire(key, 60 * 60);

      const count = await redis.scard(key);
      if (count === 1) {
        console.log(`🟢 User ${socket.userId} is now ONLINE`);
        io.emit("user:online", socket.userId);
      }

      const conversations = await getUserConversations(socket.userId, {
        all: true,
        page: 1,
        pageSize: 20,
      });
      conversations.conversations.forEach((conversation) => {
        socket.join(conversation.id);
        console.log(`🟢 User ${socket.userId} join one of his conversation`);
      });

      const teams = await getUserTeams(socket.userId, {
        all: true,
        page: 1,
        pageSize: 20,
      });

      teams.teams.forEach((team) => {
        socket.join(team.id);
        console.log(`🟢 User ${socket.userId} join one of his team`);
      });

      /**
       * Le client rejoint une conversation spécifique.
       * Chaque conversation est représentée par une "room" Socket.IO
       * permettant d’envoyer des messages uniquement aux participants.
       */
      socket.on("join_conversation", (conversationId: string) => {
        socket.join(conversationId);
        console.log(
          `🟢 User ${socket.userId} join the conversation ${conversationId}`
        );
      });

      /**
       * Le client rejoint une equipe spécifique.
       * Chaque team est représentée par une "room" Socket.IO
       * permettant d’envoyer des messages uniquement aux membres.
       */
      socket.on("join_team", (teamId: string) => {
        socket.join(teamId);
        console.log(`🟢 User ${socket.userId} join the team ${teamId}`);
      });

      /**
       * Le client quitte une equipe spécifique.
       * Chaque team est représentée par une "room" Socket.IO
       * permettant d’envoyer des messages uniquement aux membres.
       */
      socket.on("remove_team", (teamId: string) => {
        socket.leave(teamId);
        console.log(`🟢 User ${socket.userId} join the team ${teamId}`);
      });

      /**
       * Réception d’un message envoyé par un client.
       * Le serveur diffuse ensuite ce message à tous les utilisateurs
       * connectés à la même conversation.
       */
      socket.on("send_message", (message: Message) => {
        io.to(message.conversationId).emit("new_message", message);
        console.log("Nouveau message : ", message);
      });

      /**
       * Lorsqu’un message est modifié par un utilisateur,
       * le serveur notifie tous les membres de la conversation.
       */
      socket.on("edit_message", (message: Message) => {
        io.to(message.conversationId).emit("message_edited", message);
        console.log("Message modifié : ", message);
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
      socket.on("disconnect", async () => {
        console.log(
          `❌ User disconnected: ${socket.userId} (socket: ${socket.id})`
        );

        // Retirer cette socket
        await redis.srem(key, socket.id);

        // Vérifier s’il reste des connexions
        const remaining = await redis.scard(key);

        if (remaining === 0) {
          await redis.del(key);
          console.log(`🔴 User ${socket.userId} is now OFFLINE`);
          io.emit("user:offline", socket.userId);
        }
      });
    } catch (err) {
      console.log("Socket error", err);
      socket.disconnect();
    }
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
