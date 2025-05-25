const express = require('express');

const app = express();

app.use('/hello', (req, res) => {
    res.send('Hello World!');
});

app.use('/dashboard', (req, res) => {
    res.send('Dashboard');
});
    
app.listen(3000, () => {
    console.log('Server running on port 3000');
});
