import React from 'react';

function MainPage({ userData, onLogout }) {
  console.log(userData);  
  
  return (
    <div>
      <h2>Welcome, {userData?.name || 'User'}!</h2>
      <img src={userData?.photo_url} alt="User" />
      <p>Email: {userData?.email}</p>
      <button onClick={onLogout}>Logout</button>
    </div>
  );
}

export default MainPage;
