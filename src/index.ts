import express, { Request, Response } from "express";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON
app.use(express.json());

// Simple route
app.get("/", (req: Request, res: Response) => {
  res.send("Hello from TypeScript + Express 👋");
});

// Example API route
app.get("/api/users", (req: Request, res: Response) => {
  res.json([
    { id: 1, name: "Manoj" },
    { id: 2, name: "John Doe" },
  ]);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
