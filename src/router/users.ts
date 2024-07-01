import express from "express";

import { isAuthenticated, isOwner } from "../middlewares";
import { getAllUsers, deleteUser } from "../controllers/users";

export default (router: express.Router) => {
  router.get("/users", isAuthenticated, getAllUsers);
  router.delete("/users/:id", isAuthenticated, isOwner, deleteUser);
};
