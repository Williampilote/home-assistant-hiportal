module.exports = async (page, browser) => {
  try {
    // Load "https://www.hyponportal.com/signin"
    await page.goto("https://www.hyponportal.com/signin");

    // Resize window to 1920 x 953
    await page.setViewport({ width: 1280, height: 720 });

    // Click on <button> "Lire"
    await page.waitForSelector(".notice_button");
    await page.click(".notice_button");

    // Click on <input> #account
    await page.waitForSelector("#account");
    await page.click("#account");

    // Fill "auger939@gmail.... on <input> #account
    await page.waitForSelector("#account:not([disabled])");
    await page.type("#account", process.env.HIPORTAL_EMAIL);

    // Press Tab on input
    await page.waitForSelector("#account");
    await page.keyboard.press("Tab");

    // Fill "Idriss15038213*... on <input> #password
    await page.waitForSelector("#password:not([disabled])");
    await page.type("#password", process.env.HIPORTAL_PASSWORD);

    // Click on <span> "Rester connecté"
    await page.waitForSelector(".el-checkbox__label > span");
    await page.click(".el-checkbox__label > span");

    // Click on <span> "Se connecter"
    await page.waitForSelector("#loginButton > span > span");
    await Promise.all([
      page.click("#loginButton > span > span"),
      page.waitForNavigation(),
    ]);
    await page.waitForSelector(".pv8");
    return true;
  } catch (error) {
    console.log(error);
    await browser.close();
    return false;
  }
};
