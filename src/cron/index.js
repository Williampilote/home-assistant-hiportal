const CronJob = require("cron").CronJob;
const hiportal = require("../hiportal/hiportal.js");
const reGenerateIntance = require("../hiportal/reGenerateIntance.js");
const passwordVerification = require("../hiportal/passwordVerification.js");
const variables = require("../variables.js");

module.exports = async (io) => {
  new CronJob(
    "0/3 * * * * *",
    async () => {
      if (variables.refreshing) {
        return;
      }
      if (variables.renewing) {
        console.log("Waiting for token renewal");
        return;
      }
      variables.refreshing = true;
      variables.lastResult = await hiportal(
        variables.instance.page,
        variables.instance.browser
      );
      io.emit("data", variables.lastResult);
      variables.refreshing = false;
    },
    null,
    true,
    "Europe/paris"
  );
  new CronJob(
    "0 0 0/1 * * *",
    async () => {
      console.log("Renewing token");
      while (variables.refreshing) {
        console.log("Waiting for refresh to finish");
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
      variables.renewing = true;
      await variables.instance.browser.close();
      variables.instance = await reGenerateIntance();
      const result = await passwordVerification(
        variables.instance.page,
        variables.instance.browser
      );
      if (result == false) {
        console.log("Password verification failed");
        process.exit(1);
      } else {
        console.log("Password verification success");
        variables.renewing = false;
      }
    },
    null,
    true,
    "Europe/paris"
  );
};
