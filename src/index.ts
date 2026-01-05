import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import whatsappRoutes from "./routes/whatsapp.routes.js";
import userRoutes from "./routes/user.routes.js";
import bookingRoutes from "./routes/booking.routes.js";
import roomRoutes from "./routes/room.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
import reviewRoutes from "./routes/review.routes.js";
import reportRoutes from "./routes/reports.routes.js";
import inventoryRoutes from "./routes/inventory.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import offerRoutes from "./routes/offers.route.js";

import "./utils/bigint.js";

// in server.ts or app.ts
import "dotenv/config";


const app = express();

app.use(
  cors({
    origin: "http://localhost:5173", // frontend URL
    credentials: true,               // allow cookies
  })
);

app.use(express.json());
app.use(cookieParser());

app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/bookings", bookingRoutes);
app.use("/rooms", roomRoutes);
app.use("/offers", offerRoutes);
app.use("/payments", paymentRoutes);
app.use("/reviews", reviewRoutes);
app.use("/reports", reportRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/inventory", inventoryRoutes);
app.use("/whatsapp", whatsappRoutes);

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
