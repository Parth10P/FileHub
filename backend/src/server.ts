import { app } from "./app";
import { connectDatabase } from "./config/database";
import { env } from "./config/env";

const startServer = async (): Promise<void> => {
  try {
    await connectDatabase();
    app.listen(env.port, () => {
      console.log(`FileHub server running on http://localhost:${env.port}`);
    });
  } catch (error) {
    console.error("Server failed to start", error);
    process.exit(1);
  }
};

void startServer();
