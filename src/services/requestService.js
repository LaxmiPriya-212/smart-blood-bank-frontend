import api from './api';

export const requestService = {
  /**
   * Fetch blood requests from MySQL with filter parameters
   */
  async getRequests(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    const response = await api.get(`/requests?${queryParams}`);
    return response.data || [];
  },

  /**
   * Create new blood requisition ticket directly in MySQL
   */
  async createRequest(requestData) {
    return await api.post('/requests', requestData);
  },

  /**
   * Transition request status (Reserve, Issue, Reject, Cancel) via MySQL transaction
   */
  async updateRequestStatus(id, newStatus, rejectionReason = '') {
    return await api.put(`/requests/${id}/status`, { status: newStatus, rejectionReason });
  }
};

export default requestService;
