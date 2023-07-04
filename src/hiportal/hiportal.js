module.exports = async (page, browser) => {
  try {
    await page.reload();
    await page.waitForTimeout(2000);
    // Click on <span> "14.30 kWh"
    await page.waitForSelector(".pv8");
    await page.click(".pv8");
    const result = await page.evaluate(() => {
      let live_w = document.querySelector(".pv1").innerText;
      live_w = parseFloat(live_w);
      let daily_kwh = document.querySelector(".pv6").innerText;
      daily_kwh = parseFloat(daily_kwh);
      let total_kwh = document.querySelector(".pv8").innerText;
      total_kwh = parseFloat(total_kwh);
      let online = document.querySelector(".normalNum").innerText;
      let offline = document.querySelector(
        "#offlineStatus > .statusNum"
      ).innerText;
      let warning = document.querySelector(
        "#warningStatus > .statusNum"
      ).innerText;
      let error = document.querySelector("#faultStatus > .statusNum").innerText;
      return { live_w, total_kwh, daily_kwh, online, offline, warning, error };
    });
    return result;
  } catch (error) {
    console.log(error);
    await browser.close();
  }
};
