import React, { useEffect, useState } from 'react';
import axios from 'axios';

const RoomList = () => {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/rooms')
      .then(res => setRooms(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="container">
      <h2>Available Rooms</h2>
      {rooms.map(room => (
        <div key={room.id}>
          <h3>{room.name}</h3>
          <p>{room.description}</p>
          <p>Capacity: {room.occupancyLimit}</p>
          <hr />
        </div>
      ))}
    </div>
  );
};

export default RoomList;
