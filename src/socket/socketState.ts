import { io } from "../app";
import { createMessages, getMessages } from "../services";

class socketState {
  users: string[] = [];
  admin: string[] = [];
  idealUsers: string[] = [];
  idealAdmin: string[] = [];
  userIdMap: Map<string, string> = new Map();
  userAdminPair: Map<string, string> = new Map();
  constructor() {}
  registerClient(socket) {
    if (socket.handshake.query.type === "user") {
      this.users.push(socket.id);
      this.createChannleForUser(socket.id, socket.handshake.query.userId);
    } else if (socket.handshake.query.type === "admin") {
      this.admin.push(socket.id);
      this.adminJoinChannle(socket.id);
    }
  }
  createChannleForUser(id: string, userId: string) {
    if (this.idealAdmin.length === 0) {
      io.to(id).emit("notice", {
        senderSocketId: "admin",
        message: "Please wait for admin to response",
      });
      // push to ideal
      this.idealUsers.push(id);
      // create group
      this.userAdminPair.set(id, "");
    } else {
      // create user admin pair
      this.userAdminPair.set(this.idealAdmin[0], id);
      this.userAdminPair.set(id, this.idealAdmin[0]);
      io.to(id).emit("notice", {
        senderSocketId: "admin",
        message: "Admin has connected the chat",
      });
      // remove from ideal
      this.idealAdmin.shift();
    }
    this.userIdMap.set(id, userId);
  }
  async adminJoinChannle(id: string) {
    if (this.idealUsers.length === 0) {
      // put admin to ideal
      this.idealAdmin.push(id);
    } else {
      // take out first element from ideal user and join its group.
      const user = this.idealUsers[0];
      this.userAdminPair.set(id, user);
      this.userAdminPair.set(user, id);
      this.idealUsers.shift();

      io.to(user).emit("notice", {
        senderSocketId: "admin",
        message: "Admin has joined the chat",
      });
      // send the msg sent by the user to admin
      const messageArray = await getMessages(this.userIdMap.get(user));
      if (messageArray.length !== 0) {
        io.to(id).emit("sync", {
          messages: messageArray,
        });
      }
    }
  }
  async removeClient(socket) {
    // check for its user or admin
    if (socket.handshake.query.type === "user") {
      // delete admin user pair
      const admin = this.userAdminPair.get(socket.id);
      this.userAdminPair.delete(socket.id);
      this.userAdminPair.delete(admin);
      this.userIdMap.delete(socket.id);
      // push admin to ideal and check for ideal users
      io.to(admin).emit("notice", {
        senderSocketId: "user",
        message: "User has been disconnected",
      });
      this.adminJoinChannle(admin);
      this.users = this.removeElementFromArray(this.users, socket.id);
    } else if (socket.handshake.query.type === "admin") {
      // put client to ideal
      const user = this.userAdminPair.get(socket.id);
      this.idealUsers.unshift(user);
      this.userAdminPair.set(user, "");
      this.userAdminPair.delete(socket.id);
      io.to(user).emit("notice", {
        senderSocketId: "admin",
        message: "Admin has disconnceted",
      });

      this.admin = this.removeElementFromArray(this.admin, socket.id);
      if (this.idealAdmin.length !== 0) {
        // create user admin pair
        this.userAdminPair.set(this.idealAdmin[0], user);
        this.userAdminPair.set(user, this.idealAdmin[0]);
        io.to(user).emit("notice", {
          senderSocketId: "admin",
          message: "Admin has connected the chat",
        });
        this.idealUsers.shift();
        // check sync and send pervious chat to admin
        const messageArray = await getMessages(this.userIdMap.get(user));

        if (messageArray.length !== 0) {
          io.to(this.idealAdmin[0]).emit("sync", {
            messages: messageArray,
          });
        }
        // remove from ideal
        this.idealAdmin.shift();
      }
    }
  }
  removeElementFromArray(arr: string[], value: string) {
    var index = arr.indexOf(value);
    if (index > -1) {
      arr.splice(index, 1);
    }
    return arr;
  }
  handleMsg(socket, message: { msg: string }) {
    if (socket.handshake.query.type === "user") {
      // check if admin is connected or not
      const admin = this.userAdminPair.get(socket.id);
      if (admin.length !== 0) {
        io.to(admin).emit("msg", {
          senderSocketId: "user",
          msg: message.msg,
        });
      }
      // save msg in database
      createMessages({
        userId: this.userIdMap.get(socket.id),
        sentBy: "user",
        message: message.msg,
      });
    } else if (socket.handshake.query.type === "admin") {
      // store in msg send to user
      const userCheck = this.userAdminPair.has(socket.id);
      if (userCheck) {
        const user = this.userAdminPair.get(socket.id);
        io.to(user).emit("msg", {
          senderSocketId: "admin",
          msg: message.msg,
        });
        createMessages({
          userId: this.userIdMap.get(user),
          sentBy: "admin",
          message: message.msg,
        });
      } else {
        io.to(socket.id).emit("notice", {
          senderSocketId: "admin",
          msg: "User has disconnected the chat",
        });
      }
    }
  }
}

const socketstate = new socketState();
export default socketstate;
