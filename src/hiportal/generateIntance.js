module.exports = async () => {
  const puppeteer = require("puppeteer");
  const browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
    headless: "new",
  });
  const page = await browser.newPage();
  try {
    await page.setDefaultNavigationTimeout(60000);
    await page.goto("https://www.hyponportal.com/signin");
    return { page, browser };
  } catch (error) {
    await browser.close();
    console.log(error);
    process.exit(1);
  }
};
