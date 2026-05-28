// Dummy implementation of OAuth service.
// In a real implementation this would redirect to backend endpoints or use provider SDKs.

export const oauthService = {
  loginWithGoogle: () => {
    console.log("Initiating Google OAuth login");
    window.location.href = `${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/auth/google`;
  },
  loginWithGithub: () => {
    console.log("Initiating GitHub OAuth login");
    window.location.href = `${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/auth/github`;
  },
  loginWithLinkedIn: () => {
    console.log("Initiating LinkedIn OAuth login");
    window.location.href = `${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/auth/linkedin`;
  },
  loginWithApple: () => {
    console.log("Initiating Apple OAuth login");
    window.location.href = `${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/auth/apple`;
  }
};
