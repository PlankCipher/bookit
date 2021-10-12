const express = require('express');
const hallsRouter = require('./routers/halls.js');

const app = express();

app.use(express.static('client'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/halls', hallsRouter);

// eslint-disable-next-line
app.use((err, req, res, next) => {
  let statusCode;

  if (err.statusCode) {
    statusCode = err.statusCode !== 200 ? err.statusCode : 500;
  } else {
    statusCode = 500;
  }

  // eslint-disable-next-line
  console.log({ message: err.message, stack: err.stack });

  const message =
    process.env.NODE_ENV === 'production'
      ? 'Report this error, please.'
      : err.message;

  const stack =
    process.env.NODE_ENV === 'production'
      ? 'What were you expecting?'
      : err.stack;

  res.status(statusCode).json({ message, stack });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  // eslint-disable-next-line
  console.log(`App started and is listening on port: ${PORT}`),
);
