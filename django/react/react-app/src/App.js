import React, { useEffect } from 'react';




const CLIENT_ID = '111384383770-av06vjnjgop0niagg3cchtqmu77asrlq.apps.googleusercontent.com';
const CALLBACK_URL = 'http://127.0.0.1:8000/google/login/callback/';


const App = () => {
  const handleAuthCodeFlow = () => {
    const authCodeURL = `https://accounts.google.com/o/oauth2/v2/auth?redirect_uri=${encodeURIComponent(
      CALLBACK_URL
    )}&prompt=consent&response_type=code&client_id=${CLIENT_ID}&scope=openid%20email%20profile&access_type=offline`;
    window.location.href = authCodeURL;
  };

  const handleImplicitFlow = () => {
    const tokenURL = `https://accounts.google.com/o/oauth2/v2/auth?redirect_uri=${encodeURIComponent(
      CALLBACK_URL
    )}&prompt=consent&response_type=token&client_id=${CLIENT_ID}&scope=openid%20email%20profile`;
    window.location.href = tokenURL;
  };

  useEffect(() => {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const code = urlSearchParams.get('code');
    const token = urlSearchParams.get('token');

    console.log(code)
    console.log(token)

    if (code) {
      const postData = {
        code: code,
      };

      fetch('http://127.0.0.1:8000/dj-rest-auth/google/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      })
        .then(response => response.json())
        .then(data => {
          // Handle the response from your server after sending the code
        })
        .catch(error => {
          // Handle error
        });
    } else if (token) {
      // Handle the token as needed
    }
  }, []);

  return (
    <div>
      <button onClick={handleAuthCodeFlow}>Authorize (Auth Code)</button>
      <button onClick={handleImplicitFlow}>Authorize (Implicit)</button>
    </div>
  );
};

export default App;

