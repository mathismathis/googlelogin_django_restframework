import React, { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';
import Peer from 'simple-peer';

const socket = io('http://localhost:5000'); // Replace with your backend server URL

const App = () => {
  const [roomId, setRoomId] = useState('');
  const [users, setUsers] = useState([]);
  const [audioStream, setAudioStream] = useState(null);
  const [videoStream, setVideoStream] = useState(null);
  const audioRef = useRef();
  const videoRef = useRef();
  const peersRef = useRef([]);

  useEffect(() => {
    // Get user media (audio and video)
    navigator.mediaDevices
      .getUserMedia({ audio: true, video: true })
      .then((stream) => {
        setAudioStream(stream);
        setVideoStream(stream);
        audioRef.current.srcObject = stream;
        videoRef.current.srcObject = stream;

        socket.emit('joinRoom', roomId, socket.id); // Join the room after getting the media stream
      })
      .catch((error) => {
        console.error('Error accessing audio and video:', error);
      });

    // Socket events
    socket.on('connect', () => {
      console.log('Connected to server');
    });

    socket.on('usersInRoom', (userList, initiator) => {
      console.log('Users in room:', userList);
      setUsers(userList);

      userList.forEach((user) => {
        const peer = createPeer(user, socket.id, videoStream);
        peersRef.current.push({
          userId: user,
          peer,
        });
      });
    });

    socket.on('userJoined', (userId) => {
      console.log(`User ${userId} joined the room`);
      setUsers((prevUsers) => [...prevUsers, userId]);
      alert(`User ${userId} joined the room`);

      const peer = addPeer(userId, socket.id, videoStream);
      peersRef.current.push({
        userId,
        peer,
      });
    });

    socket.on('userLeft', (userId) => {
      console.log(`User ${userId} left the room`);
      setUsers((prevUsers) => prevUsers.filter((user) => user !== userId));
      const peer = peersRef.current.find((peer) => peer.userId === userId);
      if (peer) {
        peer.peer.destroy();
      }
      peersRef.current = peersRef.current.filter((peer) => peer.userId !== userId);
    });

    socket.on('signalToPeer', ({ userId, callerId, signalData }) => {
      const peer = peersRef.current.find((peer) => peer.userId === userId);
      if (peer) {
        peer.peer.signal(signalData);
      }
    });

    return () => {
      // Clean up
      if (audioStream) {
        audioStream.getTracks().forEach((track) => track.stop());
      }
      if (videoStream) {
        videoStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [audioStream, videoStream, roomId]);

  const createPeer = (userToSignal, callerId, stream) => {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream,
    });

    peer.on('signal', (signalData) => {
      socket.emit('signalToPeer', {
        userId: userToSignal,
        callerId,
        signalData,
      });
    });

    return peer;
  };

  const addPeer = (callerId, userId, stream) => {
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream,
    });

    peer.on('signal', (signalData) => {
      socket.emit('signalToPeer', {
        userId: callerId,
        callerId: userId,
        signalData,
      });
    });

    return peer;
  };

  const handleCreateRoom = () => {
    const newRoomId = uuidv4();
    setRoomId(newRoomId);
    socket.emit('joinRoom', newRoomId, socket.id);
  };

  const handleJoinRoom = () => {
    socket.emit('joinRoom', roomId, socket.id);
  };

  const handleLeaveRoom = () => {
    socket.emit('leaveRoom', roomId);
    setRoomId('');
  };

  const handleToggleAudio = () => {
    if (audioStream) {
      const audioTrack = audioStream.getAudioTracks()[0];
      audioTrack.enabled = !audioTrack.enabled;
    }
  };

  const handleToggleVideo = () => {
    if (videoStream) {
      const videoTrack = videoStream.getVideoTracks()[0];
      videoTrack.enabled = !videoTrack.enabled;
    }
  };

  return (
    <div>
      <h1>Audio and Video Chat App</h1>
      {roomId ? (
        <>
          <p>Current Room ID: {roomId}</p>
          <button onClick={handleLeaveRoom}>Leave Room</button>
        </>
      ) : (
        <>
          <button onClick={handleCreateRoom}>Create Room</button>
          <input
            type="text"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            placeholder="Enter Room ID"
          />
          <button onClick={handleJoinRoom}>Join Room</button>
        </>
      )}
      <button onClick={handleToggleAudio}>Toggle Audio</button>
      <button onClick={handleToggleVideo}>Toggle Video</button>
      <div>
        {users.map((userId) => (
          <video key={userId} ref={videoRef} muted autoPlay playsInline />
        ))}
        {users.map((userId) => (
          <audio key={userId} ref={audioRef} muted autoPlay playsInline />
        ))}
      </div>
    </div>
  );
};

export default App;
