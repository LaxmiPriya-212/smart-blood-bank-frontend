import api from './api';

export const analyticsService = {
  /**
   * Fetch live KPI overview and regional distribution from MySQL
   */
  async getSystemOverview() {
    const response = await api.get('/analytics/overview');
    return response.data;
  },

  /**
   * Fetch immutable audit logs from MySQL audit_logs table
   */
  async getAuditLogs() {
    const response = await api.get('/analytics/audit-logs');
    return response.data || [];
  },

  /**
   * Fetch live MySQL database diagnostics, connection specs, table statistics, and setup instructions
   */
  async getDatabaseDetails() {
    const response = await api.get('/analytics/database-details');
    return response.data;
  }
};

export default analyticsService;
