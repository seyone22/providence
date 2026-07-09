import { db } from "@/db";

async function connectToDatabase() {
  return db;
}

export default connectToDatabase;
