const mongoose = require("mongoose");

const postSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  user: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  comments: {
    // the comment is an array of objects that contains user, userId, comment, date, commentId
    type: Array,
    required: false,
  },
  likes: {
    type: Array,
    requried: false,
  },
});

postSchema.index({ title: "text", content: "text" });

module.exports = mongoose.model("Post", postSchema);

// function getDateDifference(dateStringFromMongoDB) {
//   const dateInMilliseconds = Date.parse(dateStringFromMongoDB);
//   const currentTimeInMilliseconds = Date.now();
//   const timeDifferenceInMilliseconds = dateInMilliseconds - currentTimeInMilliseconds;

//   // Check if the date is in the past
//   const isPastDate = timeDifferenceInMilliseconds < 0;

//   // If the date is in the past, take the absolute value of the time difference
//   const positiveTimeDifference = isPastDate ? Math.abs(timeDifferenceInMilliseconds) : timeDifferenceInMilliseconds;

//   // Calculate the time difference in days, months, hours, and minutes
//   const days = Math.floor(positiveTimeDifference / (1000 * 60 * 60 * 24));
//   const months = Math.floor(days / 30.436875); // Average number of days in a month (considering leap years)
//   const hours = Math.floor((positiveTimeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
//   const minutes = Math.floor((positiveTimeDifference % (1000 * 60 * 60)) / (1000 * 60));

//   return {
//     days,
//     months,
//     hours,
//     minutes,
//   };
// }

// const dateStringFromMongoDB = '2023-07-14T07:30:51.284+00:00';
// const dateDifference = getDateDifference(dateStringFromMongoDB);

// const {
//     days,
//     months,
//     hours,
//     minutes,
//   } = dateDifference;

// function getHighestTime(timeDifference) {
//   if (months) return {months: months};
//   if (days) return {days: days};
//   if (hours) return {hours: hours};
//   if (minutes) return {minutes: minutes};
// }

// console.log(getHighestTime(dateDifference));
