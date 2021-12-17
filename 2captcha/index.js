const puppeteer = require("puppeteer-core");
const request = require("request-promise-native");
const poll = require("promise-poller").default;
const secretData = require("./get-data");

const siteDetails = {
  sitekey: "6LcleDIUAAAAANqkex-vX88sMHw8FXuJQ3A4JKK9",
  pageUrl: "https://www.dice.com/register",
};

const launchOptions = {
  headless: false,
  executablePath:
    "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
  defaultViewport: null,
  slowMo: 10,
};

(async () => {
  const browser = await puppeteer.launch(launchOptions);
  const page = await browser.newPage();

  await page.goto("https://www.dice.com/register");

  const requestId = await initiateCaptchaRequest(secretData.getAPIKey());

  await page.type("#fname", "FirstName");
  await page.type("#lname", "LastName");
  await page.type("#email", secretData.getEmail());

  const password = secretData.getPassword();

  await page.type("#password", password);
  await page.type("#passwordConfirmation", password);

  const response = await pollForRequestResults(
    secretData.getAPIKey(),
    requestId
  );

  await page.evaluate(
    `document.getElementById("g-recaptcha-response").innerHTML="${response}";`
  );

  await page.click("#people button[type=submit]");
})();

async function initiateCaptchaRequest(apiKey) {
  const formData = {
    method: "userrecaptcha",
    googlekey: siteDetails.sitekey,
    key: secretData.getAPIKey(),
    pageurl: siteDetails.pageurl,
    json: 1,
  };

  const response = await request.post("http://2captcha.com/in.php", {
    form: formData,
  });

  return JSON.parse(response).request;
}

async function pollForRequestResults(
  key,
  id,
  retries = 30,
  interval = 1500,
  delay = 15000
) {
  await timeout(delay);
  return poll({
    taskFn: requestCaptchaResults(key, id),
    interval,
    retries,
  });
}

function requestCaptchaResults(apiKey, requestId) {
  const url = `http://2captcha.com/res.php?key=${apiKey}&action=get&id=${requestId}&json=1`;
  return async function () {
    return new Promise(async function (resolve, reject) {
      const rawResponse = await request.get(url);
      const resp = JSON.parse(rawResponse);

      if (resp.status === 0) return reject(resp.request);

      resolve(resp.request);
    });
  };
}

const timeout = (millis) =>
  new Promise((resolve) => setTimeout(resolve, millis));
