import api from './api';

export const donorService = {
  /**
   * Fetch donation history from MySQL donation_records table
   */
  async getDonorHistory(donorId) {
    const response = await api.get(`/donors/${donorId}/history`);
    return response.data || [];
  },

  /**
   * Fetch scheduled appointments from MySQL donation_appointments table
   */
  async getUpcomingAppointments(donorId) {
    const response = await api.get(`/donors/${donorId}/appointments`);
    return response.data || [];
  },

  /**
   * Book a voluntary donation appointment in MySQL
   */
  async bookAppointment(appointmentData) {
    return await api.post('/donors/appointments', appointmentData);
  },

  checkEligibility({ ageOver18, weightOver50, noRecentDonation, noChronicIllness }) {
    const isEligible = Boolean(ageOver18 && weightOver50 && noRecentDonation && noChronicIllness);
    let reasons = [];
    if (!ageOver18) reasons.push('Donor must be between 18 and 65 years old.');
    if (!weightOver50) reasons.push('Donor weight must be at least 50 kg.');
    if (!noRecentDonation) reasons.push('Must wait at least 90 days between whole blood donations.');
    if (!noChronicIllness) reasons.push('Must be in good health without acute fever or infections.');

    return {
      eligible: isEligible,
      reasons
    };
  }
};

export default donorService;
