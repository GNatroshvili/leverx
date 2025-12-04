const express = require("express");
const bcrypt = require("bcrypt");
const cors = require("cors");
const path = require("path");
const Database = require("better-sqlite3");

const app = express();
const PORT = 3000;
const SALT_ROUNDS = 10;

// initialize SQLite database
const DB_PATH = path.join(__dirname, "users.db");
const db = new Database(DB_PATH);

// create users table if it doesn't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    firstName TEXT NOT NULL,
    lastName TEXT NOT NULL,
    phone TEXT NOT NULL,
    createdAt TEXT NOT NULL
  )
`);

console.log("SQLite database initialized");

// middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// serve static files from the root directory
app.use(express.static(path.join(__dirname, "..")));

// POST /sign-up - Register a new user
app.post("/sign-up", async (req, res) => {
  try {
    const { username, password, firstName, lastName, phone } = req.body;

    // validate required fields
    if (!username || !password || !firstName || !lastName || !phone) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // check if user already exists
    const existingUser = db.prepare("SELECT * FROM users WHERE username = ?").get(username);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Username already exists",
      });
    }

    // hash the password using bcrypt
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // insert new user into database
    const createdAt = new Date().toISOString();
    const stmt = db.prepare(`
      INSERT INTO users (username, password, firstName, lastName, phone, createdAt)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    const result = stmt.run(username, hashedPassword, firstName, lastName, phone, createdAt);

    console.log(`New user registered: ${username}`);

    // return success response (without password)
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        id: result.lastInsertRowid,
        username,
        firstName,
        lastName,
        phone,
      },
    });
  } catch (error) {
    console.error("Sign-up error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// POST /sign-in - Authenticate a user
app.post("/sign-in", async (req, res) => {
  try {
    const { username, password } = req.body;

    // validate required fields
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Username and password are required",
      });
    }

    // find user by username
    const user = db.prepare("SELECT * FROM users WHERE username = ?").get(username);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid username or password",
      });
    }

    // compare password using bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid username or password",
      });
    }

    console.log(`User logged in: ${username}`);

    // return success response (without password)
    res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        id: user.id,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
      },
    });
  } catch (error) {
    console.error("Sign-in error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// GET /users - Get all users (for debugging, remove in production)
app.get("/users", (req, res) => {
  const users = db.prepare("SELECT id, username, firstName, lastName, phone, createdAt FROM users").all();

  res.json({
    success: true,
    users: users,
  });
});

// gracefully close the database on exit
process.on("SIGINT", () => {
  db.close();
  console.log("\nDatabase connection closed");
  process.exit(0);
});

// start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`\nAvailable endpoints:`);
  console.log(`  POST /sign-up - Register a new user`);
  console.log(`  POST /sign-in - Authenticate a user`);
  console.log(`  GET  /users   - Get all registered users (debug)`);
});
