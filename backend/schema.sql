-- =====================================================
-- Infrastructure Reporting System Database
-- =====================================================

DROP DATABASE IF EXISTS infrastructure_reporting_db;
CREATE DATABASE infrastructure_reporting_db;
USE infrastructure_reporting_db;

-- =====================================================
-- ROLES TABLE
-- =====================================================
CREATE TABLE roles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE
);

INSERT INTO roles (name) VALUES
('Citizen'),
('Sanitization'),
('Admin');

-- =====================================================
-- USERS TABLE
-- =====================================================
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  phone VARCHAR(20),
  address TEXT,
  password VARCHAR(255) NOT NULL,          -- ⚠ Plain password (as requested)
  role_id INT NOT NULL,
  status ENUM('PENDING','ACTIVE','BLOCKED') DEFAULT 'PENDING',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_users_role
    FOREIGN KEY (role_id) REFERENCES roles(id)
      ON DELETE RESTRICT
      ON UPDATE CASCADE
);

CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_users_role ON users(role_id);

-- =====================================================
-- DAMAGE / INFRASTRUCTURE SUBMISSIONS
-- =====================================================
CREATE TABLE submissions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  wasteType VARCHAR(100) NOT NULL,
  address TEXT NOT NULL,
  status ENUM('PENDING','ACCEPTED','WORK_DONE','REJECTED') DEFAULT 'PENDING',
  submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_submissions_user
    FOREIGN KEY (user_id) REFERENCES users(id)
      ON DELETE CASCADE
      ON UPDATE CASCADE
);

CREATE INDEX idx_submissions_status ON submissions(status);
CREATE INDEX idx_submissions_user ON submissions(user_id);

-- =====================================================
-- ISSUES RAISED BY SANITIZATION WORKERS
-- =====================================================
CREATE TABLE issues (
  id INT AUTO_INCREMENT PRIMARY KEY,
  worker_id INT NOT NULL,
  title VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  status ENUM('OPEN','CLOSED') DEFAULT 'OPEN',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_issues_worker
    FOREIGN KEY (worker_id) REFERENCES users(id)
      ON DELETE CASCADE
      ON UPDATE CASCADE
);

CREATE INDEX idx_issues_status ON issues(status);
CREATE INDEX idx_issues_worker ON issues(worker_id);

-- =====================================================
-- SEED ADMIN USER (ACTIVE BY DEFAULT)
-- =====================================================
INSERT INTO users (name, email, phone, address, password, role_id, status)
VALUES (
  'System Admin',
  'admin@system.com',
  '9999999999',
  'System Headquarters',
  'admin123',
  (SELECT id FROM roles WHERE name = 'Admin'),
  'ACTIVE'
);

-- =====================================================
-- OPTIONAL: TEST CITIZEN (ACTIVE)
-- =====================================================
INSERT INTO users (name, email, phone, address, password, role_id, status)
VALUES (
  'Test Citizen',
  'citizen@test.com',
  '8888888888',
  'Test Address',
  '123456',
  (SELECT id FROM roles WHERE name = 'Citizen'),
  'ACTIVE'
);

-- =====================================================
-- OPTIONAL: TEST SANITIZATION WORKER (ACTIVE)
-- =====================================================
INSERT INTO users (name, email, phone, address, password, role_id, status)
VALUES (
  'Test Worker',
  'worker@test.com',
  '7777777777',
  'Worker Zone',
  '123456',
  (SELECT id FROM roles WHERE name = 'Sanitization'),
  'ACTIVE'
);

-- =====================================================
-- SAMPLE SUBMISSIONS (FOR DASHBOARD TESTING)
-- =====================================================
INSERT INTO submissions (user_id, wasteType, address, status)
VALUES
(
  (SELECT id FROM users WHERE email='citizen@test.com'),
  'Road Damage',
  'Main Street',
  'PENDING'
),
(
  (SELECT id FROM users WHERE email='citizen@test.com'),
  'Drainage Overflow',
  'City Center',
  'ACCEPTED'
),
(
  (SELECT id FROM users WHERE email='citizen@test.com'),
  'Plastic Waste',
  'Market Area',
  'WORK_DONE'
);

-- =====================================================
-- SAMPLE ISSUES (FOR ADMIN VIEW)
-- =====================================================
INSERT INTO issues (worker_id, title, description)
VALUES
(
  (SELECT id FROM users WHERE email='worker@test.com'),
  'Broken Equipment',
  'Repair tools damaged during work'
),
(
  (SELECT id FROM users WHERE email='worker@test.com'),
  'Access Blocked',
  'Road blocked by construction material'
);
