exports.scheduleCall = (message) => {
  var now = new Date();
  var millisTill10 = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 10, 0, 0, 0) - now;
  if (millisTill10 < 0) {
    millisTill10 += 86400000; // it's after 10am, try 10am tomorrow.
  }
  setInterval(() => { alert('Its 10am!'); }, millisTill10);
};

//ChronJob
//