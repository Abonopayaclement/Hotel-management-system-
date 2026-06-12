const axios = require('axios');

async function testRoomDetails() {
  try {
    console.log('Fetching room list...');
    const listRes = await axios.get('http://localhost:5000/api/rooms');
    const rooms = listRes.data.data;
    if (rooms && rooms.length > 0) {
      const firstRoomId = rooms[0].id;
      console.log(`Fetching details for room ID: ${firstRoomId}...`);
      const detailRes = await axios.get(`http://localhost:5000/api/rooms/${firstRoomId}`);
      console.log('Response:', detailRes.data);
    } else {
      console.log('No rooms found.');
    }
  } catch (error) {
    console.error('Error:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
  }
}

testRoomDetails();
