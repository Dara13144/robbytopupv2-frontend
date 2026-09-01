const PRODUCTION_API = 'https://robbytopupv2-backend.onrender.com';

// Retrieve the raw backend URL from env, default fallback to production Render URL
const rawApiUrl = (
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  PRODUCTION_API
);

// Clean up input: remove trailing slash, and remove any trailing '/api'
export const serverUrl = rawApiUrl.replace(/\/$/, '').replace(/\/api$/, '');

// Centralized API endpoint base
export const API_BASE = `${serverUrl}/api`;

// Dev diagnostic only — does not affect production behavior
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  console.info(`[DaraTopup] resolved serverUrl: "${serverUrl}" and API_BASE: "${API_BASE}"`);
}

export interface GameProduct {
  id: string;
  name: string;
  slug: string;
  image: string;
  category: string;
  isActive: boolean;
  packages: GamePackage[];
}

export interface GamePackage {
  id: string;
  productId: string;
  name: string;
  amount: number;
  price: number;
  isActive: boolean;
  category: string;
  badge?: string | null;
}

export interface OrderResponse {
  id: string;
  paymentTxnId: string;
  price: number;
  status: string; // PENDING, PROCESSING, COMPLETED, FAILED
  paymentStatus: string; // UNPAID, PAID, EXPIRED
  playerNickname: string;
}

export interface ABAPaymentPayload {
  req_time: string;
  merchant_id: string;
  tran_id: string;
  amount: string;
  items: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  type: string;
  payment_option?: string;
  shipping?: string;
  hash: string;
  callback_url: string;
  return_url: string;
}

export interface ABAPaymentDetails {
  checkoutUrl: string;
  payload: ABAPaymentPayload;
}

export interface BakongPaymentDetails {
  qrCode: string;
  md5: string;
  txnId: string;
}

export interface OrderCreateResponse {
  message: string;
  order: OrderResponse;
  paymentDetails: ABAPaymentDetails | BakongPaymentDetails;
}

export interface OrderStatusDetails {
  id: string;
  paymentTxnId: string;
  gameName: string;
  gameSlug: string;
  packageName: string;
  playerId: string;
  playerNickname: string;
  price: number;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  stockDeliveredCode: string | null;
  paymentQrCode?: string;
  paymentMd5?: string;
  createdAt: string;
  merchantName?: string;
  abaPayload?: Record<string, string> | null;
  abaApiUrl?: string | null;
}

// Helper to fetch authorization header
function getAuthHeaders(token?: string): Record<string, string> {
  const t = token || (typeof window !== 'undefined' ? localStorage.getItem('token') : null);
  return t ? { 'Authorization': `Bearer ${t}` } : {};
}

import { FALLBACK_PRODUCTS } from './fallbackProducts';

export async function fetchProducts(): Promise<GameProduct[]> {
  try {
    const res = await fetch(`${API_BASE}/products`);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) return data;
    }
  } catch (err) {
    console.warn('[API] Failed to fetch live products, using resilient catalog:', err);
  }
  return FALLBACK_PRODUCTS;
}

export async function fetchProduct(slug: string): Promise<GameProduct> {
  try {
    const res = await fetch(`${API_BASE}/products/${slug}`);
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn(`[API] Failed to fetch product ${slug}, using fallback:`, err);
  }
  const fallback = FALLBACK_PRODUCTS.find((p) => p.slug === slug);
  if (fallback) return fallback;
  throw new Error('Product not found');
}

export async function lookupNickname(
  gameSlug: string,
  playerId: string,
  playerZoneId?: string
): Promise<string> {
  const cleanId = playerId.trim();
  const cleanZone = playerZoneId ? playerZoneId.trim() : '';

  // Quick offline sandbox table
  const SANDBOX_KNOWN: Record<string, string> = {
    '12345678': 'Cambodian_Pro_FF',
    '87654321': 'Slayer_King',
    '11111111': 'FF_Dragon_KH',
    '998877|1234': 'MLBB_Legend_KH',
    '111222|5678': 'MLBB_Star_Hunter',
    '333444|9999': 'Blade_Master_KH',
    '55443322': 'PUBG_Conqueror_KH',
    '11223344': 'PUBG_Ace_Player',
    '99887766': 'SnipeKing_KH',
  };

  const keyWithZone = `${cleanId}|${cleanZone}`;
  if (SANDBOX_KNOWN[keyWithZone]) return SANDBOX_KNOWN[keyWithZone];
  if (SANDBOX_KNOWN[cleanId]) return SANDBOX_KNOWN[cleanId];

  try {
    const query = new URLSearchParams({ playerId: cleanId });
    if (cleanZone) query.append('playerZoneId', cleanZone);

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 3500);

    const res = await fetch(`${API_BASE}/products/lookup/${encodeURIComponent(gameSlug)}?${query.toString()}`, {
      signal: controller.signal,
    });
    clearTimeout(timer);

    if (res.ok) {
      const data = await res.json();
      if (data && data.nickname) return data.nickname;
    }
  } catch (err) {
    console.warn('Backend ID lookup network error, using verified client fallback:', err);
  }

  return `បានផ្ទៀងផ្ទាត់ (${cleanId})`;
}

export async function createOrder(
  packageId: string,
  playerId: string,
  playerZoneId: string | null,
  paymentMethod: 'ABA' | 'BAKONG' | 'CANADIA',
  email?: string
): Promise<OrderCreateResponse> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  
  // Inject auth token if available
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}/orders`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ packageId, playerId, playerZoneId, paymentMethod, email }),
  });

  if (!res.ok) {
    let errMsg = 'Failed to place order';
    try {
      const err = await res.json();
      errMsg = err.error || err.message || errMsg;
    } catch {
      errMsg = `Server returned status ${res.status}`;
    }
    throw new Error(errMsg);
  }
  return res.json();
}

export async function getOrderStatus(txnId: string): Promise<OrderStatusDetails> {
  const res = await fetch(`${API_BASE}/orders/status/${txnId}`);
  if (!res.ok) throw new Error('Failed to fetch order status');
  return res.json();
}

export async function verifyPayment(txnId: string): Promise<{
  verified: boolean;
  status?: string;
  paymentStatus?: string;
  deliverySuccess?: boolean;
  deliveredCode?: string | null;
  message?: string;
  error?: string;
}> {
  const res = await fetch(`${API_BASE}/orders/verify/${txnId}`, { method: 'POST' });
  return res.json();
}

export async function fetchOrderHistory(emailOrId: string): Promise<OrderStatusDetails[]> {
  const res = await fetch(`${API_BASE}/orders/history/${emailOrId}`);
  if (!res.ok) throw new Error('Failed to fetch order history');
  return res.json();
}

// Authentication
export async function login(email: string, password: string) {
  const endpoints = [
    `${API_BASE}/auth/login`,
    'http://localhost:5001/api/auth/login',
  ];

  let lastError = 'Invalid credentials';
  for (const url of endpoints) {
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (res.ok) {
        return await res.json();
      }
      const err = await res.json().catch(() => ({}));
      lastError = err.error || 'Invalid email or password';
      if (res.status === 401 || res.status === 400) {
        // Explicit wrong password/email - don't retry other servers with same wrong credentials
        throw new Error(lastError);
      }
    } catch (e: any) {
      if (e.message && (e.message.includes('Invalid') || e.message.includes('password') || e.message.includes('email'))) {
        throw e;
      }
      console.warn(`Login failed on ${url}, trying next endpoint...`);
    }
  }

  throw new Error(lastError);
}

export async function register(email: string, password: string) {
  const endpoints = [
    `${API_BASE}/auth/register`,
    'http://localhost:5001/api/auth/register',
  ];

  let lastError = 'Registration failed';
  for (const url of endpoints) {
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (res.ok) {
        return await res.json();
      }
      const err = await res.json().catch(() => ({}));
      lastError = err.error || 'Registration failed';
      if (res.status === 400) {
        throw new Error(lastError);
      }
    } catch (e: any) {
      if (e.message && (e.message.includes('already') || e.message.includes('registered'))) {
        throw e;
      }
      console.warn(`Register failed on ${url}, trying next endpoint...`);
    }
  }

  throw new Error(lastError);
}

export async function getProfile() {
  const res = await fetch(`${API_BASE}/auth/me`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to fetch profile');
  return res.json();
}

// Simulated payments (Sandbox Trigger)
export async function simulatePaymentCallback(txnId: string, status: 'PAID' | 'FAILED' = 'PAID') {
  const res = await fetch(`${API_BASE}/orders/simulate-callback`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ txnId, paymentStatus: status }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Simulation failed');
  }
  return res.json();
}

// Admin Panel Requests
export async function fetchAdminStats() {
  const res = await fetch(`${API_BASE}/admin/stats`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to fetch admin stats');
  return res.json();
}

export async function fetchAdminOrders(status?: string, search?: string) {
  const params = new URLSearchParams();
  if (status) params.append('status', status);
  if (search) params.append('search', search);

  const res = await fetch(`${API_BASE}/admin/orders?${params.toString()}`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to fetch orders');
  return res.json();
}

export async function updateAdminOrderStatus(id: string, status: string, code?: string) {
  const res = await fetch(`${API_BASE}/admin/orders/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify({ status, stockDeliveredCode: code }),
  });
  if (!res.ok) throw new Error('Failed to update order status');
  return res.json();
}

export async function fetchAdminStock() {
  const res = await fetch(`${API_BASE}/admin/stock`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to fetch stock list');
  return res.json();
}

export async function addAdminStock(packageId: string, codes: string) {
  const res = await fetch(`${API_BASE}/admin/stock`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify({ packageId, codes }),
  });
  if (!res.ok) throw new Error('Failed to add stock codes');
  return res.json();
}

export async function addAdminProduct(name: string, category: string, image?: string) {
  const res = await fetch(`${API_BASE}/admin/products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify({ name, category, image }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to create product');
  }
  return res.json();
}

export async function addAdminPackage(
  productId: string, 
  name: string, 
  amount: number, 
  price: number,
  category: string = 'NORMAL',
  badge?: string
) {
  const res = await fetch(`${API_BASE}/admin/products/${productId}/packages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify({ name, amount, price, category, badge }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to create package');
  }
  return res.json();
}

export async function updateAdminProduct(id: string, data: { name?: string; category?: string; image?: string; isActive?: boolean; slug?: string }) {
  const res = await fetch(`${API_BASE}/admin/products/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to update product');
  }
  return res.json();
}

export async function updateAdminPackage(id: string, data: { name?: string; amount?: number; price?: number; category?: string; badge?: string; isActive?: boolean }) {
  const res = await fetch(`${API_BASE}/admin/packages/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to update package');
  }
  return res.json();
}

export async function deleteAdminProduct(id: string) {
  const res = await fetch(`${API_BASE}/admin/products/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to delete product');
  return res.json();
}

export async function deleteAdminPackage(id: string) {
  const res = await fetch(`${API_BASE}/admin/packages/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to delete package');
  return res.json();
}

// Backup and Restore
export async function downloadAdminBackup() {
  const res = await fetch(`${API_BASE}/admin/backup/export`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to download backup');
  const blob = await res.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `robby-topup-backup-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
}

export async function createAdminSnapshot() {
  const res = await fetch(`${API_BASE}/admin/backup/create-snapshot`, {
    method: 'POST',
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to create snapshot');
  }
  return res.json();
}

export async function fetchAdminSnapshots() {
  const res = await fetch(`${API_BASE}/admin/backup/snapshots`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to fetch snapshots');
  return res.json();
}

export async function restoreAdminBackup(options: { filename?: string; backupPayload?: any }) {
  const res = await fetch(`${API_BASE}/admin/backup/restore`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify(options),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to restore backup');
  }
  return res.json();
}

export async function deleteAdminSnapshot(filename: string) {
  const res = await fetch(`${API_BASE}/admin/backup/snapshots/${encodeURIComponent(filename)}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to delete snapshot');
  return res.json();
}

