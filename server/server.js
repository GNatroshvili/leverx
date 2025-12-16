

import express from "express";
import bcrypt from "bcrypt";
import cors from "cors";
import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import Database from "better-sqlite3";
import { fileURLToPath } from "url";
import process from "process";


const app = express();
const PORT = 3000;
const SALT_ROUNDS = 10;

// polyfill __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
    isAdmin INTEGER DEFAULT 0,
    role TEXT DEFAULT 'employee',
    createdAt TEXT
  )
`);

// add isAdmin and role columns to existing table if they don't exist
try {
  db.exec(`ALTER TABLE employees ADD COLUMN isAdmin INTEGER DEFAULT 0`);
  console.log('Added isAdmin column to employees table');
} catch {
  // column already exists
}

try {
  db.exec(`ALTER TABLE employees ADD COLUMN role TEXT DEFAULT 'employee'`);
  console.log('Added role column to employees table');
} catch {
  // column already exists
}

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
        isRegisteredUser, isAdmin, role, createdAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
          0,
          'employee',
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
    isRegisteredUser: row.isRegisteredUser === 1,
    isAdmin: row.isAdmin === 1,
    role: row.role || 'employee'
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

    // validate required fields and input formats
    if (!email || !password || !firstName || !lastName || !phone) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }
    if (typeof firstName !== 'string' || firstName.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: "First name must be at least 2 characters.",
      });
    }
    if (typeof lastName !== 'string' || lastName.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: "Last name must be at least 2 characters.",
      });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address.",
      });
    }
    const phoneDigits = String(phone).replace(/\D/g, "");
    if (phoneDigits.length < 4) {
      return res.status(400).json({
        success: false,
        message: "Phone number must be at least 4 digits.",
      });
    }
    const passwordRegex = /^(?=.*[A-Z]).{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters and contain at least one uppercase letter.",
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
        _id, isRemoteWork, user_avatar, first_name, last_name, phone, email, isRegisteredUser, isAdmin, role, createdAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
      0,
      'employee',
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

    // validate required fields and input formats
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address.",
      });
    }
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters.",
      });
    }

    // find user by email
    const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // compare password using bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // fetch employee data to get role and admin status
    const employee = db.prepare("SELECT * FROM employees WHERE email = ?").get(email);
    const isAdmin = employee ? employee.isAdmin === 1 : false;
    const role = employee ? employee.role || 'employee' : 'employee';

    console.log(`User logged in: ${email} (Role: ${role}, Admin: ${isAdmin})`);

    // return success response (without password)
    res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        id: user.id,
        employeeId: user.employeeId,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        isAdmin: isAdmin,
        role: role,
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

// GET /users - get all employees from database
app.get("/users", (req, res) => {
  try {
    const { search } = req.query;
    
    let query = "SELECT * FROM employees";
    let params = [];
    
    // add search filter if search query is provided
    if (search && search.trim()) {
      const searchTerm = `%${search.trim().toLowerCase()}%`;
      query += ` WHERE LOWER(first_name) LIKE ? OR LOWER(last_name) LIKE ? OR LOWER(first_name || ' ' || last_name) LIKE ?`;
      params = [searchTerm, searchTerm, searchTerm];
    }
    
    query += " ORDER BY createdAt DESC";
    
    const rows = params.length > 0 
      ? db.prepare(query).all(...params)
      : db.prepare(query).all();
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

// GET /users/:id - get a single employee by ID from database
app.get("/users/:id", (req, res) => {
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

// PUT /users/:id/role - update employee role and admin status (admin only)
app.put("/users/:id/role", (req, res) => {
  try {
    const { id } = req.params;
    const { role, isAdmin, requestingUserEmail } = req.body;

    // validate role value
    if (role && !['employee', 'manager'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role. Must be 'employee' or 'manager'",
      });
    }

    // validate isAdmin value
    if (isAdmin !== undefined && isAdmin !== null && typeof isAdmin !== 'boolean') {
      return res.status(400).json({
        success: false,
        message: "Invalid isAdmin value. Must be boolean",
      });
    }

    // check if requesting user is admin
    const requestingEmployee = db.prepare("SELECT * FROM employees WHERE email = ?").get(requestingUserEmail);
    if (!requestingEmployee || requestingEmployee.isAdmin !== 1) {
      return res.status(403).json({
        success: false,
        message: "Only administrators can update roles",
      });
    }

    // check if target employee exists
    const targetEmployee = db.prepare("SELECT * FROM employees WHERE _id = ?").get(id);
    if (!targetEmployee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    // update role and/or isAdmin status
    const updateStmt = db.prepare(`
      UPDATE employees 
      SET role = COALESCE(?, role), 
          isAdmin = COALESCE(?, isAdmin)
      WHERE _id = ?
    `);
    
    updateStmt.run(
      role || null,
      isAdmin !== undefined ? (isAdmin ? 1 : 0) : null,
      id
    );

    // fetch updated employee
    const updatedRow = db.prepare("SELECT * FROM employees WHERE _id = ?").get(id);
    const updatedEmployee = dbRowToEmployee(updatedRow);

    console.log(`Role updated for ${targetEmployee.email}: role=${updatedEmployee.role}, isAdmin=${updatedEmployee.isAdmin}`);

    res.json({
      success: true,
      message: "Role updated successfully",
      employee: updatedEmployee,
    });
  } catch (error) {
    console.error("Error updating role:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// PUT /users/:id - update employee data (admin or HR for subordinates)
app.put("/users/:id", (req, res) => {
  try {
    const { id } = req.params;
    const { updates, requestingUserEmail } = req.body;

    if (!updates || typeof updates !== 'object' || Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No updates provided",
      });
    }

    // get requesting user
    const requestingEmployee = db.prepare("SELECT * FROM employees WHERE email = ?").get(requestingUserEmail);
    if (!requestingEmployee) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    // get target employee
    const targetEmployee = db.prepare("SELECT * FROM employees WHERE _id = ?").get(id);
    if (!targetEmployee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    // check permissions
    const isAdmin = requestingEmployee.isAdmin === 1;
    const isHR = requestingEmployee.role === 'manager';
    const isSubordinate = targetEmployee.manager_id === requestingEmployee._id;

    if (!isAdmin && !(isHR && isSubordinate)) {
      return res.status(403).json({
        success: false,
        message: "You don't have permission to edit this employee",
      });
    }

    // build update query dynamically
    const allowedFields = [
      'first_name', 'last_name', 
      'first_native_name', 'middle_native_name', 'last_native_name',
      'date_birth_year', 'date_birth_month', 'date_birth_day',
      'department', 'building', 'room', 'desk_number', 
      'phone', 'email', 'skype', 'cnumber', 'citizenship',
      'manager_id'
    ];
    const updateFields = [];
    const updateValues = [];

    // if manager_id is being updated, also update manager names
    if (Object.prototype.hasOwnProperty.call(updates, 'manager_id')) {
      const managerId = updates.manager_id;
      if (managerId) {
        const manager = db.prepare("SELECT first_name, last_name FROM employees WHERE _id = ?").get(managerId);
        if (manager) {
          updates.manager_first_name = manager.first_name;
          updates.manager_last_name = manager.last_name;
        }
      } else {
        // if manager_id is null/empty, clear manager names
        updates.manager_first_name = null;
        updates.manager_last_name = null;
      }
    }

    // add manager name fields to allowed fields
    const allAllowedFields = [...allowedFields, 'manager_first_name', 'manager_last_name'];

    for (const [key, value] of Object.entries(updates)) {
      if (allAllowedFields.includes(key)) {
        updateFields.push(`${key} = ?`);
        updateValues.push(value);
      }
    }

    if (updateFields.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid fields to update",
      });
    }

    // add employee ID to values
    updateValues.push(id);

    const updateQuery = `UPDATE employees SET ${updateFields.join(', ')} WHERE _id = ?`;
    const updateStmt = db.prepare(updateQuery);
    updateStmt.run(...updateValues);

    // fetch updated employee
    const updatedRow = db.prepare("SELECT * FROM employees WHERE _id = ?").get(id);
    const updatedEmployee = dbRowToEmployee(updatedRow);

    console.log(`Employee data updated for ${targetEmployee.email} by ${requestingUserEmail}`);

    res.json({
      success: true,
      message: "Employee updated successfully",
      employee: updatedEmployee,
    });
  } catch (error) {
    console.error("Error updating employee:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// gracefully close the database on exit
if (typeof process !== "undefined" && process.on) {
  process.on("SIGINT", () => {
    db.close();
    console.log("\nDatabase connection closed");
    process.exit(0);
  });
}

// start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`\nAvailable endpoints:`);
  console.log(`  POST /sign-up            - Register a new user`);
  console.log(`  POST /sign-in            - Authenticate a user`);
  console.log(`  GET  /auth/users         - Get all registered users (debug)`);
  console.log(`  GET  /users              - Get all employees`);
  console.log(`  GET  /users/:id          - Get employee by ID`);
  console.log(`  PUT  /users/:id/role     - Update employee role (admin only)`);
  console.log(`  PUT  /users/:id          - Update employee data (admin/HR)`);
});
