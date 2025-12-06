const express = require("express");
const bcrypt = require("bcrypt");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const Database = require("better-sqlite3");

const app = express();
const PORT = 3000;
const SALT_ROUNDS = 10;

// initialize SQLite database
const DB_PATH = path.join(__dirname, "users.db");
const db = new Database(DB_PATH);

// create users table if it doesn't exist (for authentication)
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    firstName TEXT NOT NULL,
    lastName TEXT NOT NULL,
    phone TEXT NOT NULL,
    createdAt TEXT NOT NULL,
    employeeId TEXT UNIQUE
  )
`);

// create employees table if it doesn't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS employees (
    _id TEXT PRIMARY KEY,
    isRemoteWork INTEGER DEFAULT 0,
    user_avatar TEXT DEFAULT './assets/default-avatar.jpg',
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    first_native_name TEXT,
    last_native_name TEXT,
    middle_native_name TEXT,
    department TEXT,
    building TEXT,
    room TEXT,
    date_birth_year INTEGER,
    date_birth_month INTEGER,
    date_birth_day INTEGER,
    desk_number INTEGER,
    manager_id TEXT,
    manager_first_name TEXT,
    manager_last_name TEXT,
    phone TEXT,
    email TEXT,
    skype TEXT,
    cnumber TEXT,
    citizenship TEXT,
    visa1_issuing_country TEXT,
    visa1_type TEXT,
    visa1_start_date INTEGER,
    visa1_end_date INTEGER,
    visa2_issuing_country TEXT,
    visa2_type TEXT,
    visa2_start_date INTEGER,
    visa2_end_date INTEGER,
    isRegisteredUser INTEGER DEFAULT 0,
    createdAt TEXT
  )
`);

console.log("SQLite database initialized");

// seed employees from JSON file if employees table is empty
const EMPLOYEES_PATH = path.join(__dirname, "employees.json");
const employeeCount = db.prepare("SELECT COUNT(*) as count FROM employees").get();

if (employeeCount.count === 0) {
  try {
    const employeesJson = fs.readFileSync(EMPLOYEES_PATH, "utf8");
    const employeesData = JSON.parse(employeesJson);
    
    const insertEmployee = db.prepare(`
      INSERT INTO employees (
        _id, isRemoteWork, user_avatar, first_name, last_name,
        first_native_name, last_native_name, middle_native_name,
        department, building, room,
        date_birth_year, date_birth_month, date_birth_day,
        desk_number, manager_id, manager_first_name, manager_last_name,
        phone, email, skype, cnumber, citizenship,
        visa1_issuing_country, visa1_type, visa1_start_date, visa1_end_date,
        visa2_issuing_country, visa2_type, visa2_start_date, visa2_end_date,
        isRegisteredUser, createdAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    const insertMany = db.transaction((employees) => {
      for (const emp of employees) {
        insertEmployee.run(
          emp._id,
          emp.isRemoteWork ? 1 : 0,
          emp.user_avatar,
          emp.first_name,
          emp.last_name,
          emp.first_native_name || null,
          emp.last_native_name || null,
          emp.middle_native_name || null,
          emp.department || null,
          emp.building || null,
          emp.room || null,
          emp.date_birth?.year || null,
          emp.date_birth?.month || null,
          emp.date_birth?.day || null,
          emp.desk_number || null,
          emp.manager?.id || null,
          emp.manager?.first_name || null,
          emp.manager?.last_name || null,
          emp.phone || null,
          emp.email || null,
          emp.skype || null,
          emp.cnumber || null,
          emp.citizenship || null,
          emp.visa?.[0]?.issuing_country || null,
          emp.visa?.[0]?.type || null,
          emp.visa?.[0]?.start_date || null,
          emp.visa?.[0]?.end_date || null,
          emp.visa?.[1]?.issuing_country || null,
          emp.visa?.[1]?.type || null,
          emp.visa?.[1]?.start_date || null,
          emp.visa?.[1]?.end_date || null,
          0,
          new Date().toISOString()
        );
      }
    });
    
    insertMany(employeesData);
    console.log(`Seeded ${employeesData.length} employees from employees.json`);
  } catch (error) {
    console.error("Error seeding employees:", error.message);
  }
} else {
  console.log(`Employees table already has ${employeeCount.count} records`);
}

// helper function to convert DB row to employee object format
function dbRowToEmployee(row) {
  return {
    _id: row._id,
    isRemoteWork: row.isRemoteWork === 1,
    user_avatar: row.user_avatar || "./assets/default-avatar.jpg",
    first_name: row.first_name,
    last_name: row.last_name,
    first_native_name: row.first_native_name || "N/A",
    last_native_name: row.last_native_name || "N/A",
    middle_native_name: row.middle_native_name || "N/A",
    department: row.department || "N/A",
    building: row.building || "N/A",
    room: row.room || "N/A",
    date_birth: row.date_birth_year ? {
      year: row.date_birth_year,
      month: row.date_birth_month,
      day: row.date_birth_day
    } : null,
    desk_number: row.desk_number || "N/A",
    manager: row.manager_first_name ? {
      id: row.manager_id,
      first_name: row.manager_first_name,
      last_name: row.manager_last_name
    } : { id: null, first_name: "N/A", last_name: "" },
    phone: row.phone || "N/A",
    email: row.email || "N/A",
    skype: row.skype || "N/A",
    cnumber: row.cnumber || "N/A",
    citizenship: row.citizenship || "N/A",
    visa: buildVisaArray(row),
    isRegisteredUser: row.isRegisteredUser === 1
  };
}

// helper function to build visa array from DB row
function buildVisaArray(row) {
  const visas = [];
  if (row.visa1_issuing_country) {
    visas.push({
      issuing_country: row.visa1_issuing_country,
      type: row.visa1_type,
      start_date: row.visa1_start_date,
      end_date: row.visa1_end_date
    });
  }
  if (row.visa2_issuing_country) {
    visas.push({
      issuing_country: row.visa2_issuing_country,
      type: row.visa2_type,
      start_date: row.visa2_start_date,
      end_date: row.visa2_end_date
    });
  }
  return visas;
}

// middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// serve static files from the root directory
app.use(express.static(path.join(__dirname, "..")));

// POST /sign-up - Register a new user
app.post("/sign-up", async (req, res) => {
  try {
    const { email, password, firstName, lastName, phone } = req.body;

    // validate required fields
    if (!email || !password || !firstName || !lastName || !phone) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // check if user already exists
    const existingUser = db.prepare("SELECT * FROM users WHERE email = ?").get(email);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email already exists",
      });
    }

    // hash the password using bcrypt
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // generate unique employee ID for this user
    const employeeId = uuidv4();
    const createdAt = new Date().toISOString();

    // insert new user into users table with employeeId reference
    const userStmt = db.prepare(`
      INSERT INTO users (email, password, firstName, lastName, phone, createdAt, employeeId)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    const userResult = userStmt.run(email, hashedPassword, firstName, lastName, phone, createdAt, employeeId);

    // also insert into employees table with default values and email
    const employeeStmt = db.prepare(`
      INSERT INTO employees (
        _id, isRemoteWork, user_avatar, first_name, last_name, phone, email, isRegisteredUser, createdAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    employeeStmt.run(
      employeeId,
      0,
      "./assets/default-avatar.jpg",
      firstName,
      lastName,
      phone,
      email,
      1,
      createdAt
    );

    console.log(`New user registered: ${email} (Employee ID: ${employeeId})`);

    // return success response (without password)
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        id: userResult.lastInsertRowid,
        employeeId,
        email,
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
    const { email, password } = req.body;

    // validate required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // find user by email
    const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // compare password using bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    console.log(`User logged in: ${email}`);

    // return success response (without password)
    res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        id: user.id,
        email: user.email,
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

// GET /auth/users - get all registered users (for debugging, remove in production)
app.get("/auth/users", (req, res) => {
  const users = db.prepare("SELECT id, email, firstName, lastName, phone, createdAt, employeeId FROM users").all();

  res.json({
    success: true,
    users: users,
  });
});

// GET /employees - get all employees from database
app.get("/employees", (req, res) => {
  try {
    const rows = db.prepare("SELECT * FROM employees ORDER BY createdAt DESC").all();
    const employees = rows.map(dbRowToEmployee);
    
    res.json({
      success: true,
      employees: employees,
    });
  } catch (error) {
    console.error("Error fetching employees:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// GET /employees/:id - get a single employee by ID from database
app.get("/employees/:id", (req, res) => {
  try {
    const { id } = req.params;
    const row = db.prepare("SELECT * FROM employees WHERE _id = ?").get(id);

    if (!row) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    const employee = dbRowToEmployee(row);

    res.json({
      success: true,
      employee: employee,
    });
  } catch (error) {
    console.error("Error fetching employee:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
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
  console.log(`  POST /sign-up      - Register a new user`);
  console.log(`  POST /sign-in      - Authenticate a user`);
  console.log(`  GET  /auth/users   - Get all registered users (debug)`);
  console.log(`  GET  /employees    - Get all employees`);
  console.log(`  GET  /employees/:id - Get employee by ID`);
});
