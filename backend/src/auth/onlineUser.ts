export const onlineUsers: Set<string> = new Set();
export const setUserOnline = (userId: string) => {
  onlineUsers.add(userId);
  console.log("Utilisateurs en ligne :", onlineUsers);
};

export const setUserOffline = (userId: string) => {
  onlineUsers.delete(userId);
  console.log("Utilisateurs en ligne :", onlineUsers);
};

export const isUserOnline = (userId: string): boolean => {
  console.log("online users inside isUserOnline:", onlineUsers);
  return onlineUsers.size > 0 && onlineUsers.has(userId);
};
