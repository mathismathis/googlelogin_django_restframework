import React from 'react';

const GoogleLoginButton = () => {
  const handleGoogleLogin = async () => {
    const client_id = 'YOUR_CLIENT_ID';
    const redirect_uri = 'YOUR_CALLBACK_URL';
    const scope = 'openid email profile';

    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?redirect_uri=${redirect_uri}&response_type=code&client_id=${client_id}&scope=${scope}&access_type=offline`;

    window.location.href = authUrl;
  };

  return (
    <button onClick={handleGoogleLogin}>Login with Google</button>
  );
};

export default GoogleLoginButton;
