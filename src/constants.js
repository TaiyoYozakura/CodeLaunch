export const navText = "DOTTECH 2026 | CODE EVOLUTION 2026";
export const eventName = "CODE EVOLUTION 2026";
export const festName = "DOTTECH 2026";
export const deptName = "Department of Computer Science & Engineering";
export const deskNumber = "DESK 0101";

export const tabTimers = {
  detect: 300,    // 5 minutes in seconds
  predict: 600,   // 10 minutes
  transform: 900, // 15 minutes
  decoded: 1200   // 20 minutes
};

export const tabPasswords = {
  detect: "ALPHA123",
  predict: "BETA456",
  transform: "GAMMA789",
  decoded: "DELTA0"
};

// Bonus round popup message
export const bonusRoundMessage = {
  title: "🎉 SPECIAL INVITATION 🎉",
  message: "You have been selected as the only worthy candidate to take the hidden round of CODE EVOLUTION!",
  warning: "But be careful, till date only Goku, Iron Man, Batman, and Naruto have won this challenge.",
  question: "Will you be one of the winners who'll eat chicken dinner (paneer dinner if vegetarian)?"
};

export const passwordDialogDelay = 10;
export const bonusRoundMinTime = 120; // 2 minutes in seconds
export const reloadProtectionDuration = 1000;

// OneCompiler URLs for different languages
export const oneCompilerUrls = {
  py: 'https://onecompiler.com/python',
  java: 'https://onecompiler.com/java',
  c: 'https://onecompiler.com/c',
  cpp: 'https://onecompiler.com/cpp',
  js: 'https://onecompiler.com/javascript',
  html: 'https://onecompiler.com/html',
  css: 'https://onecompiler.com/html',
  sql: 'https://onecompiler.com/mysql',
  xml: 'https://onecompiler.com/xml'
};

// Sample table data for DB questions
export const sampleTableData = `
-- Sample 'students' table with 10 rows and 5 columns
CREATE TABLE students (
    id INT PRIMARY KEY,
    name VARCHAR(50),
    age INT,
    grade CHAR(1),
    city VARCHAR(30)
);

INSERT INTO students VALUES
(1, 'Alice Johnson', 20, 'A', 'New York'),
(2, 'Bob Smith', 19, 'B', 'Los Angeles'),
(3, 'Charlie Brown', 21, 'A', 'Chicago'),
(4, 'Diana Prince', 18, 'B', 'Houston'),
(5, 'Eve Wilson', 22, 'C', 'Phoenix'),
(6, 'Frank Miller', 20, 'A', 'Philadelphia'),
(7, 'Grace Lee', 19, 'B', 'San Antonio'),
(8, 'Henry Davis', 21, 'A', 'San Diego'),
(9, 'Ivy Chen', 18, 'C', 'Dallas'),
(10, 'Jack Taylor', 20, 'B', 'San Jose');
`;

export const mysqlConfig = {
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'tiger',
};