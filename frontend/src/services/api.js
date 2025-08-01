import axios from 'axios';

// Use VITE_API_URL from .env
const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    // Removed token logging for security
  }
  return config;
});

// Auth
export const register = (data) => api.post('/auth/register', data);
export const login = (data) => api.post('/auth/login', data);

// Wishlist APIs
export const getWishlists = () => api.get('/wishlists');
export const getWishlist = (id) => api.get(`/wishlists/${id}`);
export const createWishlist = (data) => api.post('/wishlists', data);
export const updateWishlist = (id, data) => api.put(`/wishlists/${id}`, data);
export const deleteWishlist = (id) => api.delete(`/wishlists/${id}`);

// Product APIs (within a wishlist)
export const getProducts = (wishlistId) => api.get(`/wishlists/${wishlistId}`); // products are populated in wishlist
export const addProduct = (wishlistId, data) => api.post(`/wishlists/${wishlistId}/products`, data);
export const updateProduct = (wishlistId, productId, data) => api.put(`/wishlists/${wishlistId}/products/${productId}`, data);
export const deleteProduct = (wishlistId, productId) => api.delete(`/wishlists/${wishlistId}/products/${productId}`);

export async function addComment(wishlistId, productId, data) {
  return axios.post(`${API_URL}/wishlists/${wishlistId}/products/${productId}/comments`, data, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
}

export async function addReaction(wishlistId, productId, data) {
  return axios.post(`${API_URL}/wishlists/${wishlistId}/products/${productId}/reactions`, data, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
}

export async function findUser({ email, username }) {
  const params = new URLSearchParams();
  if (email) params.append('email', email);
  if (username) params.append('username', username);
  return axios.get(`${API_URL}/auth/find-user?${params.toString()}`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
}

export async function inviteMember(wishlistId, data) {
  return axios.post(`${API_URL}/wishlists/${wishlistId}/invite`, data, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
}

export async function leaveWishlist(wishlistId) {
  return axios.post(`${API_URL}/wishlists/${wishlistId}/leave`, {}, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
}

export async function getAllUsers() {
  return api.get('/auth/all-users');
}

export async function getNotifications() {
  return api.get('/auth/notifications');
}

// Get pending invites for the logged-in user
export async function getPendingInvites() {
  return api.get('/auth/me'); // Assuming /auth/me returns user info including pendingInvites
}

// Accept an invite to a wishlist
export async function acceptInvite(wishlistId) {
  return api.post(`/wishlists/${wishlistId}/accept-invite`);
} 