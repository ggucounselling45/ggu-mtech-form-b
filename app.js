import express from "express";
import dotenv from "dotenv";
import connectDB from "./src/config/db.js";
import cookieParser from "cookie-parser";
import "./src/config/cloudinary.js";
import userRoutes from "./src/routes/user.route.js";
import initFormSettings from "./src/utils/initFormSettings.js";
import cors from "cors";




import adminRoutes from "./src/routes/admin.routes.js";

dotenv.config();
console.log(process.env.MONGODB_URI);



// connectDB();
await connectDB();

await initFormSettings();
const app = express();


app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://ggu-mtech-form-p89u.vercel.app"
  ],
  credentials: true,
}));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/admin", adminRoutes);
app.use("/api/user", userRoutes);

app.listen(4000, () => {
    console.log("Server Started");
});


app.get("/", (req, res) => {
    res.send("Backend Running");
});


