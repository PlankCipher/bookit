const express = require('express');

const app = express();

app.use(express.static('client'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`App started and is listening on port: ${PORT}`),
);
