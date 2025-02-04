import { Router } from 'express';
import fs from 'fs/promises';
import path from 'path';
import bcrypt from 'bcrypt';

const router = Router();
const USERS_FILE = path.join(__dirname, '../data/users.json');

interface User {
  id: string;
  name: string;
  apellido: string;
  email: string;
  password: string;
  role: number;
  twoFactorSecret: string;
  verified: boolean;
  failedAttempts: number;
  lastAttemptTime: number;
}

async function readUsers(): Promise<User[]> {
  try {
    const data = await fs.readFile(USERS_FILE, 'utf8');
    return JSON.parse(data).users;
  } catch (error) {
    console.error('Error reading users file:', error);
    return [];
  }
}

async function writeUsers(users: User[]): Promise<void> {
  try {
    await fs.writeFile(USERS_FILE, JSON.stringify({ users }, null, 2), 'utf8');
  } catch (error) {
    console.error('Error writing users file:', error);
    throw new Error('Error saving user data');
  }
}

router.post('/register', async (req, res) => {
  try {
    const { name, apellido, email, password, role } = req.body;

    // Validate required fields
    if (!name || !apellido || !email || !password) {
      return res.status(400).json({ message: 'Todos los campos son requeridos' });
    }

    // Read existing users
    const users = await readUsers();

    // Check if email already exists
    if (users.some(user => user.email === email)) {
      return res.status(400).json({ message: 'El email ya está registrado' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser: User = {
      id: (users.length + 1).toString(),
      name,
      apellido,
      email,
      password: hashedPassword,
      role: role || 2,
      twoFactorSecret: "", // Will be set during first login
      verified: false,
      failedAttempts: 0,
      lastAttemptTime: 0
    };

    // Add user and save to file
    users.push(newUser);
    await writeUsers(users);

    // Return success without sensitive data
    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      }
    });

  } catch (error) {
    console.error('Error in registration:', error);
    res.status(500).json({ message: 'Error en el registro' });
  }
});

export default router; 