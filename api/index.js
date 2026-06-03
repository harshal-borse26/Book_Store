import express from "express";
import connectDB from "../config/db.js";
import authRoutes from "../routes/auth.routes.js";
import booksRoutes from "../routes/book.routes.js";
import orderRoutes from "../routes/order.routes.js";
import aiRoutes from "../routes/ai.routes.js";
import cors from "cors";
import wishlistRoutes from "../routes/wishlist.routes.js";
const app = express();
app.use(cors());
app.use(express.json());
connectDB();

const PORT = 3000;

app.get("/", (req, res) => {
  res.send("Bookstore Api is running");
});

app.use("/api/wishlist", wishlistRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/books", booksRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/ai", aiRoutes);

app.listen(PORT, () => {
  console.log(`Server is running at ${PORT}`);
});
