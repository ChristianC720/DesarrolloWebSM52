import { totp } from 'otplib';
import bcrypt from 'bcryptjs';

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

interface Session {
  userId: string;
  token: string;
  expiresAt: number;
}

// Configure TOTP
totp.options = { 
  digits: 6,
  step: 30,
  window: 1 // Allows 1 step before/after for time drift
};

// Load users from localStorage
const loadUsers = (): User[] => {
  const storedUsers = localStorage.getItem('users');
  if (storedUsers) {
    return JSON.parse(storedUsers);
  }
  const initialUsers = [{
    id: "1",
    name: "Admin",
    apellido: "User",
    email: "admin@test.com",
    password: "password123",
    role: 1,
    twoFactorSecret: generateBase32Secret(), // Generate proper secret for Google Auth
    verified: false,
    failedAttempts: 0,
    lastAttemptTime: 0
  }];
  localStorage.setItem('users', JSON.stringify(initialUsers));
  return initialUsers;
};

// Generate a proper Base32 secret for Google Authenticator
function generateBase32Secret(): string {
  const base32Chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  const array = new Uint8Array(20);
  window.crypto.getRandomValues(array);
  let secret = '';
  for (let i = 0; i < 16; i++) {
    secret += base32Chars[array[i] % 32];
  }
  return secret;
}

let users = loadUsers();

class UserService {
  private sessions: Session[] = [];
  private readonly MAX_ATTEMPTS = 3;
  private readonly COOLDOWN_PERIOD = 5 * 60 * 1000;

  private saveUsers(): void {
    localStorage.setItem('users', JSON.stringify(users));
  }

  async findUserByEmail(email: string): Promise<User | undefined> {
    console.log('Looking for email:', email); // Debug log
    console.log('Available users:', users); // Debug log
    return users.find(user => user.email.toLowerCase() === email.toLowerCase());
  }

  private generateSecret(): string {
    // Generate a random string using browser's crypto API
    const array = new Uint8Array(20);
    window.crypto.getRandomValues(array);
    return Array.from(array, byte => 
      byte.toString(16).padStart(2, '0')
    ).join('').toUpperCase();
  }

  async createUser(userData: { name: string; apellido: string; email: string; password: string; role: number }): Promise<User> {
    if (users.some(user => user.email.toLowerCase() === userData.email.toLowerCase())) {
      throw new Error('El email ya está registrado');
    }

    const newUser: User = {
      ...userData,
      id: (users.length + 1).toString(),
      twoFactorSecret: generateSecret(),
      verified: false,
      failedAttempts: 0,
      lastAttemptTime: 0
    };

    users.push(newUser);
    this.saveUsers();
    console.log('New user created:', newUser); // Debug log
    return newUser;
  }

  async verifyPassword(password: string, storedPassword: string): Promise<boolean> {
    console.log('Comparing passwords:', { input: password, stored: storedPassword }); // Debug log
    return password === storedPassword; // Direct comparison
  }

  async updateUserVerification(userId: string): Promise<void> {
    const user = users.find(u => u.id === userId);
    if (user) {
      user.verified = true;
    }
  }

  getTwoFactorQRCodeUrl(email: string, secret: string): string {
    // Format specifically for Google Authenticator
    const issuer = 'YourAppName';
    const encodedIssuer = encodeURIComponent(issuer);
    const encodedEmail = encodeURIComponent(email);
    return `otpauth://totp/${encodedIssuer}:${encodedEmail}?secret=${secret}&issuer=${encodedIssuer}&algorithm=SHA1&digits=6&period=30`;
  }

  private generateSecureToken(): string {
    const array = new Uint8Array(32);
    window.crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  createSession(userId: string): string {
    const token = this.generateSecureToken();
    const expiresAt = Date.now() + (24 * 60 * 60 * 1000); // 24 hours
    
    this.sessions.push({ userId, token, expiresAt });
    this.sessions = this.sessions.filter(session => session.expiresAt > Date.now());
    
    return token;
  }

  validateSession(token: string): string | null {
    const session = this.sessions.find(s => s.token === token);
    if (!session || session.expiresAt < Date.now()) {
      return null;
    }
    return session.userId;
  }

  removeSession(token: string): void {
    this.sessions = this.sessions.filter(s => s.token !== token);
  }

  verifyTwoFactorToken(token: string, secret: string, userId: string): { isValid: boolean; error?: string } {
    const user = users.find(u => u.id === userId);
    if (!user) {
      return { isValid: false, error: "Usuario no encontrado" };
    }

    if (this.isInCooldown(user)) {
      const remainingTime = Math.ceil((user.lastAttemptTime + this.COOLDOWN_PERIOD - Date.now()) / 1000 / 60);
      return { 
        isValid: false, 
        error: `Demasiados intentos fallidos. Por favor espere ${remainingTime} minutos.` 
      };
    }

    // Verify the token format
    if (!token.match(/^\d{6}$/)) {
      this.recordFailedAttempt(user);
      return { isValid: false, error: "El código debe ser de 6 dígitos" };
    }

    // For development testing, accept specific codes
    // In production, you would implement proper TOTP verification
    const validTestCodes = ['123456', '000000'];
    const isValid = validTestCodes.includes(token);

    if (!isValid) {
      this.recordFailedAttempt(user);
      const remainingAttempts = this.MAX_ATTEMPTS - user.failedAttempts;
      return { 
        isValid: false, 
        error: `Código inválido. ${remainingAttempts} intentos restantes.` 
      };
    }

    // Reset failed attempts on successful verification
    user.failedAttempts = 0;
    user.lastAttemptTime = 0;
    this.saveUsers();
    return { isValid: true };
  }

  private isInCooldown(user: User): boolean {
    const now = Date.now();
    const cooldownEnd = user.lastAttemptTime + this.COOLDOWN_PERIOD;
    return now < cooldownEnd;
  }

  private recordFailedAttempt(user: User): void {
    user.failedAttempts++;
    user.lastAttemptTime = Date.now();
    this.saveUsers();
  }
}

export const userService = new UserService();