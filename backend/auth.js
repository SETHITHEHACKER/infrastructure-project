// backend/auth.js
import db from "./db.js";

/**
 * REGISTER USER
 */
export async function registerUser(data) {
  const { name, email, phone, address, password, role } = data;

  const roleResult = await db.query(
    "SELECT id FROM roles WHERE name = $1",
    [role]
  );

  const roleRow = roleResult.rows[0];

  if (!roleRow) {
    throw new Error("Invalid role");
  }

  await db.query(
    `INSERT INTO users (name, email, phone, address, password, role_id, status)
     VALUES ($1,$2,$3,$4,$5,$6,$7)`,
    [name, email, phone, address, password, roleRow.id, "PENDING"]
  );

  return { message: "Registration successful. Wait for admin approval." };
}


/**
 * LOGIN USER
 */
export async function loginUser(email, password) {

  const result = await db.query(
    `SELECT u.id, u.name, u.email, u.status, r.name AS role
     FROM users u
     JOIN roles r ON u.role_id = r.id
     WHERE u.email = $1 AND u.password = $2`,
    [email, password]
  );

  const user = result.rows[0];

  if (!user) {
    throw new Error("Invalid email or password");
  }

  if (user.status === "PENDING") {
    throw new Error("Your account is pending admin approval");
  }

  if (user.status === "BLOCKED") {
    throw new Error("Your account has been blocked by admin");
  }

  return user;
}
