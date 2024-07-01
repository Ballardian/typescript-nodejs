import express from "express";

import { getUsers, deleteUserById } from "../db/users";

export const getAllUsers = async (
  request: express.Request,
  response: express.Response
) => {
  try {
    const users = await getUsers();
    return response.status(200).json(users).end();
  } catch (error) {
    console.log(error);
    return response.sendStatus(400);
  }
};

export const deleteUser = async (
  request: express.Request,
  response: express.Response
) => {
  try {
    const { id } = request.params;
    const deletedUser = await deleteUserById(id);
    return response.json(deletedUser).end();
  } catch (error) {
    console.log(error);
    return response.sendStatus(400);
  }
};
