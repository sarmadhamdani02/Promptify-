"use server"

import mongoose from "mongoose";

type connectionObject = {
  isConnected?: number;
};

const connection: connectionObject = {};

async function dbConnect(): Promise<void> {
  if (connection.isConnected) {
    console.log("dbConnect.ts : dbConnect() : Already Connected to DB ✔ ");
    return;
  }

  try {
    const db = await mongoose.connect(process.env.MONGODB_URI || "");

    connection.isConnected = db.connections[0].readyState;
    console.error("dbConnect.ts, : dbConnect() :: DB Connected Successfully ✔");
  } catch (error) {
    console.error(
      "dbConnect.ts",
      " :: dbConnect() :: DB Connection Error ❌ : ",
      error
    );
    process.exit(1);
  }
}

export default dbConnect;
