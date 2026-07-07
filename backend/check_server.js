const http = require('http');

http.get('http://localhost:5000/api/rooms', (res) => {
  console.log('Status Code:', res.statusCode);
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    console.log('Response:', data.substring(0, 200));
  });
}).on('error', (err) => {
  console.error('Error connecting to server:', err.message);
});
