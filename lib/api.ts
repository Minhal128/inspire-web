// API Configuration
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://sea-lion-app-2u676.ondigitalocean.app';

// Generic API request function
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem('token');

  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(`${API_URL}${endpoint}`, config);

  if (response.status === 401) {
    // Token expired or invalid
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
    throw new Error('Unauthorized');
  }

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }

  return data;
}

// Auth API
export const authAPI = {
  login: async (email: string, password: string, rememberMe: boolean, role: string) => {
    return apiRequest<{
      success: boolean;
      message: string;
      token: string;
      user: {
        id: string;
        fullName: string;
        email: string;
        role: string;
      };
    }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password, rememberMe, role }),
    });
  },

  signup: async (fullName: string, email: string, password: string, role: string) => {
    return apiRequest<{
      success: boolean;
      message: string;
      token: string;
      user: {
        id: string;
        fullName: string;
        email: string;
        role: string;
      };
    }>('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ fullName, email, password, role }),
    });
  },

  getMe: async () => {
    return apiRequest<{
      success: boolean;
      user: {
        id: string;
        fullName: string;
        email: string;
        role: string;
        phone?: string;
        language?: string;
        timezone?: string;
      };
    }>('/api/auth/me');
  },

  logout: async () => {
    return apiRequest<{ success: boolean; message: string }>('/api/auth/logout', {
      method: 'POST',
    });
  },

  verifyToken: async () => {
    return apiRequest<{ success: boolean; valid: boolean }>('/api/auth/verify-token', {
      method: 'POST',
    });
  },

  getCaptcha: async () => {
    return apiRequest<{
      success: boolean;
      captchaId: string;
      captchaImage: string;
    }>('/api/captcha/generate');
  },

  signupWithCaptcha: async (
    fullName: string,
    email: string,
    password: string,
    role: string,
    captchaId: string,
    captchaCode: string
  ) => {
    return apiRequest<{
      success: boolean;
      message: string;
      token?: string;
      user?: {
        id: string;
        fullName: string;
        email: string;
        role: string;
      };
      requiresVerification?: boolean;
    }>('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ fullName, email, password, role, captchaId, captchaCode }),
    });
  },

  sendVerificationEmail: async (email: string) => {
    return apiRequest<{ success: boolean; message: string }>('/api/auth/send-verification-email', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  verifyEmail: async (email: string, otp: string) => {
    return apiRequest<{ success: boolean; message: string }>('/api/auth/verify-email', {
      method: 'POST',
      body: JSON.stringify({ email, otp }),
    });
  },

  resendVerificationOTP: async (email: string) => {
    return apiRequest<{ success: boolean; message: string }>('/api/auth/resend-verification-otp', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  forgotPassword: async (email: string) => {
    return apiRequest<{ success: boolean; message: string }>('/api/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  verifyResetOTP: async (email: string, otp: string) => {
    return apiRequest<{ success: boolean; message: string }>('/api/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ email, otp }),
    });
  },

  resetPassword: async (email: string, otp: string, newPassword: string) => {
    return apiRequest<{ success: boolean; message: string }>('/api/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ email, otp, newPassword }),
    });
  },

  resendResetOTP: async (email: string) => {
    return apiRequest<{ success: boolean; message: string }>('/api/auth/resend-reset-otp', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  socialLogin: async (email: string, fullName: string, portal: string, provider: string) => {
    return apiRequest<{
      success: boolean;
      message: string;
      token: string;
      user: {
        id: string;
        fullName: string;
        email: string;
        role: string;
      };
    }>('/api/auth/social-login', {
      method: 'POST',
      body: JSON.stringify({ email, fullName, portal, provider }),
    });
  },
};

// Properties API
export const propertiesAPI = {
  create: async (propertyData: {
    propertyId: string;
    name: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    buildings: number;
    units: number;
  }) => {
    return apiRequest<{ success: boolean; message: string; property: any }>(
      '/api/properties',
      {
        method: 'POST',
        body: JSON.stringify(propertyData),
      }
    );
  },

  createBulk: async (properties: Array<{
    propertyId: string;
    name: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    buildings: number;
    units: number;
  }>) => {
    return apiRequest<{ success: boolean; message: string; properties: any[]; errors?: any[] }>(
      '/api/properties/bulk',
      {
        method: 'POST',
        body: JSON.stringify({ properties }),
      }
    );
  },

  getDropdownData: async () => {
    return apiRequest<{
      success: boolean;
      data: {
        countries: string[];
        states: Record<string, string[]>;
        cities: Record<string, Record<string, string[]>>;
      };
    }>('/api/properties/dropdown-data');
  },

  getAll: async (params?: {
    search?: string;
    state?: string;
    city?: string;
    status?: string;
    page?: number;
    limit?: number;
  }) => {
    const queryString = new URLSearchParams(
      Object.entries(params || {}).filter(([_, v]) => v !== undefined) as [string, string][]
    ).toString();
    return apiRequest<{
      success: boolean;
      properties: any[];
      pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
      };
    }>(`/api/properties${queryString ? `?${queryString}` : ''}`);
  },

  getById: async (id: string) => {
    return apiRequest<{ success: boolean; property: any }>(`/api/properties/${id}`);
  },

  update: async (id: string, propertyData: any) => {
    return apiRequest<{ success: boolean; message: string; property: any }>(
      `/api/properties/${id}`,
      {
        method: 'PUT',
        body: JSON.stringify(propertyData),
      }
    );
  },

  delete: async (id: string) => {
    return apiRequest<{ success: boolean; message: string }>(`/api/properties/${id}`, {
      method: 'DELETE',
    });
  },

  setReadyForInspection: async (id: string) => {
    return apiRequest<{ success: boolean; message: string; property: any }>(
      `/api/properties/${id}/ready`,
      {
        method: 'PATCH',
      }
    );
  },

  hold: async (id: string) => {
    return apiRequest<{ success: boolean; message: string; property: any }>(
      `/api/properties/${id}/hold`,
      {
        method: 'PATCH',
      }
    );
  },

  getStats: async () => {
    return apiRequest<{
      success: boolean;
      stats: {
        totalProperties: number;
        totalBuildings: number;
        totalUnits: number;
        activeProperties: number;
        readyForInspection: number;
      };
    }>('/api/properties/stats');
  },

  getAllManagement: async (params?: any) => {
    const queryString = new URLSearchParams(
      Object.entries(params || {}).filter(([_, v]) => v !== undefined) as [string, string][]
    ).toString();
    return apiRequest<{ success: boolean; properties: any[]; pagination: any }>(
      `/api/properties/all${queryString ? `?${queryString}` : ''}`
    );
  },
};

// Inspections API
export const inspectionsAPI = {
  create: async (inspectionData: any) => {
    return apiRequest<{ success: boolean; message: string; inspection: any }>(
      '/api/inspections',
      {
        method: 'POST',
        body: JSON.stringify(inspectionData),
      }
    );
  },

  getAll: async (params?: {
    status?: string;
    property?: string;
    page?: number;
    limit?: number;
  }) => {
    const queryString = new URLSearchParams(
      Object.entries(params || {}).filter(([_, v]) => v !== undefined) as [string, string][]
    ).toString();
    return apiRequest<{
      success: boolean;
      inspections: any[];
      pagination: any;
    }>(`/api/inspections${queryString ? `?${queryString}` : ''}`);
  },

  getById: async (id: string) => {
    return apiRequest<{ success: boolean; inspection: any }>(`/api/inspections/${id}`);
  },

  update: async (id: string, data: any) => {
    return apiRequest<{ success: boolean; message: string; inspection: any }>(
      `/api/inspections/${id}`,
      {
        method: 'PUT',
        body: JSON.stringify(data),
      }
    );
  },

  complete: async (id: string, data: any) => {
    return apiRequest<{ success: boolean; message: string; inspection: any }>(
      `/api/inspections/${id}/complete`,
      {
        method: 'PATCH',
        body: JSON.stringify(data),
      }
    );
  },

  delete: async (id: string) => {
    return apiRequest<{ success: boolean; message: string }>(`/api/inspections/${id}`, {
      method: 'DELETE',
    });
  },

  getStats: async () => {
    return apiRequest<{
      success: boolean;
      stats: {
        totalInspections: number;
        completed: number;
        scheduled: number;
        inProgress: number;
        passed: number;
        failed: number;
        averageScore: number;
      };
    }>('/api/inspections/stats');
  },

  createRequest: async (requestData: any) => {
    return apiRequest<{ success: boolean; message: string; request: any }>(
      '/api/inspections/request',
      {
        method: 'POST',
        body: JSON.stringify(requestData),
      }
    );
  },

  getRequests: async (params?: any) => {
    const queryString = new URLSearchParams(
      Object.entries(params || {}).filter(([_, v]) => v !== undefined) as [string, string][]
    ).toString();
    return apiRequest<{ success: boolean; requests: any[]; pagination: any }>(
      `/api/inspections/requests${queryString ? `?${queryString}` : ''}`
    );
  },

  generateShareLink: async (id: string) => {
    return apiRequest<{
      success: boolean;
      message: string;
      shareUrl: string;
      expiresAt: string;
    }>(`/api/inspections/${id}/share`, {
      method: 'POST',
    });
  },

  getSharedReport: async (token: string) => {
    return apiRequest<{ success: boolean; inspection: any }>(
      `/api/inspections/shared/${token}`
    );
  },

  getUnitStatus: async (propertyId: string, buildingId: string) => {
    return apiRequest<{
      success: boolean;
      statuses: any[];
      unitStatusMap: Record<string, boolean>;
    }>(`/api/inspections/unit-status?property_id=${propertyId}&building_id=${buildingId}`);
  },

  saveProgress: async (data: any) => {
    return apiRequest<{
      success: boolean;
      msg: string;
      buildingInspectionId: string;
    }>('/api/inspections/progress', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  getProgress: async (params: {
    property_id: string;
    unit_id?: string;
    inspection_type?: string;
    draft_only?: string;
  }) => {
    const queryString = new URLSearchParams(
      Object.entries(params).filter(([_, v]) => v !== undefined) as [string, string][]
    ).toString();
    return apiRequest<{
      success: boolean;
      items?: Record<string, string>;
      inspectionData?: any;
      progress?: any[];
    }>(`/api/inspections/progress?${queryString}`);
  },
};

// Orders API
export const ordersAPI = {
  create: async (orderData: any) => {
    return apiRequest<{ success: boolean; message: string; order: any }>('/api/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  },

  getAll: async (params?: {
    status?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) => {
    const queryString = new URLSearchParams(
      Object.entries(params || {}).filter(([_, v]) => v !== undefined) as [string, string][]
    ).toString();
    return apiRequest<{ success: boolean; orders: any[]; pagination: any }>(
      `/api/orders${queryString ? `?${queryString}` : ''}`
    );
  },

  getById: async (id: string) => {
    return apiRequest<{ success: boolean; order: any }>(`/api/orders/${id}`);
  },

  update: async (id: string, data: any) => {
    return apiRequest<{ success: boolean; message: string; order: any }>(
      `/api/orders/${id}`,
      {
        method: 'PUT',
        body: JSON.stringify(data),
      }
    );
  },

  delete: async (id: string) => {
    return apiRequest<{ success: boolean; message: string }>(`/api/orders/${id}`, {
      method: 'DELETE',
    });
  },

  getStats: async () => {
    return apiRequest<{
      success: boolean;
      stats: {
        totalOrders: number;
        pending: number;
        completed: number;
        inProgress: number;
        totalRevenue: number;
        completedToday: number;
      };
    }>('/api/orders/stats');
  },
};

// Assets API
export const assetsAPI = {
  create: async (assetData: any) => {
    return apiRequest<{ success: boolean; message: string; asset: any }>('/api/assets', {
      method: 'POST',
      body: JSON.stringify(assetData),
    });
  },

  getAll: async (params?: {
    status?: string;
    category?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) => {
    const queryString = new URLSearchParams(
      Object.entries(params || {}).filter(([_, v]) => v !== undefined) as [string, string][]
    ).toString();
    return apiRequest<{ success: boolean; assets: any[]; pagination: any }>(
      `/api/assets${queryString ? `?${queryString}` : ''}`
    );
  },

  getById: async (id: string) => {
    return apiRequest<{ success: boolean; asset: any }>(`/api/assets/${id}`);
  },

  update: async (id: string, data: any) => {
    return apiRequest<{ success: boolean; message: string; asset: any }>(
      `/api/assets/${id}`,
      {
        method: 'PUT',
        body: JSON.stringify(data),
      }
    );
  },

  delete: async (id: string) => {
    return apiRequest<{ success: boolean; message: string }>(`/api/assets/${id}`, {
      method: 'DELETE',
    });
  },

  addMaintenance: async (id: string, maintenanceData: any) => {
    return apiRequest<{ success: boolean; message: string; asset: any }>(
      `/api/assets/${id}/maintenance`,
      {
        method: 'POST',
        body: JSON.stringify(maintenanceData),
      }
    );
  },

  getStats: async () => {
    return apiRequest<{
      success: boolean;
      stats: {
        totalAssets: number;
        active: number;
        maintenance: number;
        inactive: number;
        totalValue: number;
      };
    }>('/api/assets/stats');
  },
};

// Users API
export const usersAPI = {
  updateProfile: async (profileData: {
    fullName?: string;
    email?: string;
    phone?: string;
    language?: string;
    timezone?: string;
    role?: string;
  }) => {
    return apiRequest<{ success: boolean; message: string; user: any }>(
      '/api/users/profile',
      {
        method: 'PUT',
        body: JSON.stringify(profileData),
      }
    );
  },

  changePassword: async (currentPassword: string, newPassword: string) => {
    return apiRequest<{ success: boolean; message: string }>('/api/users/password', {
      method: 'PUT',
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  },

  updateNotificationSettings: async (
    emailNotifications: boolean,
    inAppNotifications: boolean
  ) => {
    return apiRequest<{ success: boolean; message: string }>('/api/users/notifications', {
      method: 'PUT',
      body: JSON.stringify({ emailNotifications, inAppNotifications }),
    });
  },

  toggleTwoFactor: async () => {
    return apiRequest<{ success: boolean; message: string; twoFactorEnabled: boolean }>(
      '/api/users/2fa/toggle',
      {
        method: 'POST',
      }
    );
  },

  getAllUsers: async (params?: { role?: string; search?: string; page?: number; limit?: number }) => {
    const queryString = new URLSearchParams(
      Object.entries(params || {}).filter(([_, v]) => v !== undefined) as [string, string][]
    ).toString();
    return apiRequest<{ success: boolean; users: any[]; pagination: any }>(
      `/api/users${queryString ? `?${queryString}` : ''}`
    );
  },

  getOtherUsers: async (params?: { role?: string; search?: string; page?: number; limit?: number }) => {
    const queryString = new URLSearchParams(
      Object.entries(params || {}).filter(([_, v]) => v !== undefined) as [string, string][]
    ).toString();
    return apiRequest<{ success: boolean; users: any[]; pagination: any }>(
      `/api/users/others${queryString ? `?${queryString}` : ''}`
    );
  },
};

// Admin API (for management portal)
export const adminAPI = {
  getInspections: async (params?: { status?: string; search?: string; page?: number; limit?: number }) => {
    const queryString = new URLSearchParams(
      Object.entries(params || {}).filter(([_, v]) => v !== undefined) as [string, string][]
    ).toString();
    return apiRequest<{ success: boolean; inspections: any[]; pagination: any }>(
      `/api/admin/inspections${queryString ? `?${queryString}` : ''}`
    );
  },
  getStats: async () => {
    return apiRequest<{ success: boolean; stats: any }>('/api/admin/stats');
  },
};

// Payments API
export const paymentsAPI = {
  checkReportUnlock: async (inspectionId: string) => {
    return apiRequest<{ success: boolean; isReportUnlocked: boolean }>(
      `/api/payments/check-unlock/${encodeURIComponent(inspectionId)}`
    );
  },

  createStripeCheckoutSession: async (inspectionId: string) => {
    return apiRequest<{
      success: boolean;
      message: string;
      checkoutUrl?: string;
      sessionId?: string;
      isReportUnlocked?: boolean;
      alreadyUnlocked?: boolean;
    }>('/api/payments/create-stripe-checkout-session', {
      method: 'POST',
      body: JSON.stringify({ inspectionId }),
    });
  },

  getStripeSessionStatus: async (sessionId: string) => {
    return apiRequest<{
      success: boolean;
      paymentStatus: string;
      isReportUnlocked: boolean;
      sessionId: string;
    }>(`/api/payments/stripe-session-status/${encodeURIComponent(sessionId)}`);
  },
};

export default {
  auth: authAPI,
  properties: propertiesAPI,
  inspections: inspectionsAPI,
  orders: ordersAPI,
  assets: assetsAPI,
  users: usersAPI,
  admin: adminAPI,
  payments: paymentsAPI,
};
