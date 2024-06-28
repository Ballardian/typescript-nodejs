import express from "express";

import { createUser, getUserByEmail } from "../db/users";
import { random, authentication } from "../helpers";

export const signUp = async (
  request: express.Request,
  response: express.Response
) => {
  try {
    const { email, password, username } = request.body;

    if (!email || !password || !username) {
      return response.sendStatus(400);
    }

    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return response.sendStatus(400);
    }

    const salt = random();
    const user = await createUser({
      email,
      username,
      authentication: {
        salt,
        password: authentication(salt, password),
      },
    });

    return response.status(201).json(user).end();
  } catch (error) {
    console.log(error);
    return response.sendStatus(400);
  }
};

export const login = async (
  request: express.Request,
  response: express.Response
) => {
  try {
    const { email, password } = request.body;
    if (!email || !password) {
      return response.sendStatus(400);
    }

    // Get hidden fields
    const user = await getUserByEmail(email).select(
      "+authentication.salt +authentication.password"
    );
    if (!user) {
      return response.sendStatus(400);
    }
    const expectedHash = authentication(user.authentication.salt, password);
    if (expectedHash !== user.authentication.password) {
      return response.sendStatus(403);
    }

    const salt = random();
    user.authentication.sessionToken = authentication(
      salt,
      user._id.toString()
    );

    await user.save();

    response.cookie("sessionToken", user.authentication.sessionToken, {
      domain: "localhost",
      path: "/",
    });
    return response.status(200).json(user).end();
  } catch (error) {
    console.log(error);
    return response.sendStatus(400);
  }
};
