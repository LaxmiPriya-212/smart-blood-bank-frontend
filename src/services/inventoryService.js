import api from './api';

export const inventoryService = {
  /**
   * Query real-time blood inventory from MySQL
   */
  async getInventory(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    const response = await api.get(`/inventory?${queryParams}`);
    return response.data || [];
  },

  /**
   * Register a new batch directly into MySQL cold-storage inventory
   */
  async addBatch(batchData) {
    return await api.post('/inventory', batchData);
  },

  /**
   * Update batch units, temperature, or status in MySQL
   */
  async updateStock(id, data) {
    return await api.put(`/inventory/${id}`, data);
  }
};

export default inventoryService;
