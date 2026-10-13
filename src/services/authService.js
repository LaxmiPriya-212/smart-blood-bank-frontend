import api from './api';

// Demo account credentials provisioned in MySQL database with password 'Password@123'
export const DEMO_ACCOUNTS = {
  admin: {
    id: 1,
    fullName: 'System Administrator',
    email: 'admin@bloodbank.org',
    role: 'admin',
    phone: '+91 9876543210',
    bloodGroup: 'O+',
    city: 'Mumbai',
    password: 'Password@123'
  },
  blood_bank: {
    id: 2,
    fullName: 'Metro Central Blood Bank',
    email: 'metro.bank@bloodbank.org',
    role: 'blood_bank',
    phone: '+91 9876543211',
    bloodGroup: 'O+',
    city: 'Mumbai',
    licenseNumber: 'BB-MH-MUM-2023-0192',
    password: 'Password@123'
  },
  hospital: {
    id: 4,
    fullName: 'Apex Memorial Hospital',
    email: 'apex.hospital@bloodbank.org',
    role: 'hospital',
    phone: '+91 9876543213',
    city: 'Mumbai',
    registrationCode: 'HOSP-REG-MUM-4821',
    password: 'Password@123'
  },
  donor: {
    id: 6,
    fullName: 'Rahul Sharma',
    email: 'rahul.donor@gmail.com',
    role: 'donor',
    phone: '+91 9876543215',
    bloodGroup: 'O-',
    city: 'Mumbai',
    password: 'Password@123'
  },
  patient: {
    id: 8,
    fullName: 'Sneha Deshmukh',
    email: 'sneha.patient@gmail.com',
    role: 'patient',
    phone: '+91 9876543217',
    bloodGroup: 'AB+',
    city: 'Mumbai',
    password: 'Password@123'
  }
};

export const authService = {
  /**
   * Authenticate user credentials against MySQL backend API
   */
  async login(credentials) {
    const response = await api.post('/auth/login', credentials);
    if (response.token && response.user) {
      localStorage.setItem('sbb_auth_token', response.token);
      localStorage.setItem('sbb_auth_user', JSON.stringify(response.user));
      return { success: true, user: response.user, token: response.token };
    }
    return response;
  },

  /**
   * Register new user account directly into MySQL
   */
  async register(userData) {
    const response = await api.post('/auth/register', userData);
    if (response.token && response.user) {
      localStorage.setItem('sbb_auth_token', response.token);
      localStorage.setItem('sbb_auth_user', JSON.stringify(response.user));
      return { success: true, user: response.user, token: response.token };
    }
    return response;
  },

  /**
   * Authenticate a pre-provisioned demo account against MySQL to obtain a genuine JWT
   */
  async demoLogin(roleKey) {
    const demo = DEMO_ACCOUNTS[roleKey];
    if (!demo) {
      throw new Error(`Demo account for role '${roleKey}' not found.`);
    }

    try {
      const response = await api.post('/auth/login', {
        email: demo.email,
        password: demo.password || 'Password@123'
      });

      if (response.token && response.user) {
        localStorage.setItem('sbb_auth_token', response.token);
        localStorage.setItem('sbb_auth_user', JSON.stringify(response.user));
        return { success: true, user: response.user, token: response.token };
      }
      return response;
    } catch (err) {
      console.warn('[authService] MySQL login failed for demo account, checking fallback:', err.message);
      throw err;
    }
  },

  getCurrentUser() {
    try {
      const stored = localStorage.getItem('sbb_auth_user');
      return stored ? JSON.parse(stored) : null;
    } catch (e) {
      return null;
    }
  },

  logout() {
    localStorage.removeItem('sbb_auth_token');
    localStorage.removeItem('sbb_auth_user');
  }
};

export default authService;
