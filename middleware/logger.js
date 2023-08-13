const fs = require("fs");
const fsPromises = require("fs").promises;
const path = require("path");

const logEvents = async (message, logFileName) => {
  try {
    if (!fs.existsSync(path.join(__dirname, "..", "logs"))) {
      await fsPromises.mkdir(path.join(__dirname, "..", "logs"));
    }
    await fsPromises.appendFile(
      path.join(__dirname, "..", "logs", logFileName),
      message
    );
  } catch (err) {
    console.log(err);
  }
};

const requestLog = (req, res, next) => {
  const message = `${req.method} \t ${req.url} \t ${
    req.headers.origin
  } \t ${new Date().toLocaleString()} \n`;
  logEvents(message, "requests.log");
  // console.log(`${req.method} ${req.path}`);
  next();
};

module.exports = { requestLog };
