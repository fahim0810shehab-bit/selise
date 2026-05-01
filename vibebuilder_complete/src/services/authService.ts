// TODO SELISE IAM: Replace with real auth token logic if needed.
// Currently relying on existing logic.

export const authService = {
  getCurrentUser: () => {
    const savedProfile = localStorage.getItem('selise_user_profile');
    try {
      return savedProfile ? JSON.parse(savedProfile) : null;
    } catch {
      return null;
    }
  },
  isAuthenticated: () => {
    return !!localStorage.getItem('selise_user_profile');
  },
  logout: () => {
    localStorage.removeItem('selise_auth_token');
    localStorage.removeItem('selise_refresh_token');
    localStorage.removeItem('selise_user_profile');
  }
};
