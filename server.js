const http = require("http");
const https = require("https");

const botToken = "8307826403:AAH_0-rpFE6anQzcAsMsCCee-pRqBcfX2S8";
const girlChat = "7902408074";
const myChat = "6588436417";

function sendTelegram(chatID, text) {
  const url = `https://api.telegram.org/bot${botToken}/sendMessage?chat_id=${chatID}&text=${encodeURIComponent(text)}`;
  https.get(url);
}

function getCountry(ip, callback) {
  https.get(`https://ipapi.co/${ip}/country`, (res) => {
    let data = "";
    res.on("data", (chunk) => (data += chunk));
    res.on("end", () => callback(data.trim()));
  }).on("error", () => callback(""));
}

const server = http.createServer((req, res) => {
  if (req.url !== "/") {
    res.writeHead(404);
    return res.end();
  }

  const ip = req.headers["x-forwarded-for"]?.split(",")[0] 
          || req.headers["x-real-ip"] 
          || req.socket.remoteAddress;

  getCountry(ip, (country) => {
    if (country === "UA") {
      sendTelegram(girlChat, "Любимая, я смог подключиться к сайту!\n\nСо мной все хорошо, люблю тебя ❤️\n\nГлавное жди меня.");
      sendTelegram(myChat, "Подключился к сайту. Со мной всё хорошо.");
    }
  });

  res.writeHead(200, { "Content-Type": "text/html" });
  res.end("<!DOCTYPE html><html><head></head><body></body></html>");
});

server.listen(8080, () => {
  console.log("Сервер запущен на http://localhost:8080");
});
