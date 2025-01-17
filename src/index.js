/* 任意設定する変数 */
const bookTypesNum = 500; /* todo 取ってくる本の幅: 1以上101未満の数字 */
const animationTime = 15000; // cssのanimationTimeと一致させる！
const fetchWeatherInfoInterval = 3600000; // 1時間おき
const maxRainfall = 88.7;

/* いじらない */
let interval;
const leftPositions = [];

setSentenceByWeatherInfo();
setInterval(setSentenceByWeatherInfo, fetchWeatherInfoInterval);

/**/

function setSentenceByWeatherInfo() {
  if (interval) {
    clearInterval(interval);
  }
  getWeatherInfo().then((res) => {
    let appearanceRate = 4000;
    if ("rain" in res.current) {
      if (res.current.rain["1h"] > 20) {
        appearanceRate *= 1 - res.current.rain["1h"] / maxRainfall;
      }
      console.log(appearanceRate);
      interval = setInterval(createSentence, appearanceRate);
      return;
    }
    interval = setInterval(createSentence, appearanceRate);
  });
}

/**/

async function getSentence() {
  let id = Math.round(Math.random() * bookTypesNum) + 3;
  let res = await fetch(`https://api.bungomail.com/v0/books/${id}`);
  let json = await res.json();

  while (
    !("書き出し" in json.book) &&
    !("作品名" in json.book) &&
    json.book["書き出し"] !== ""
  ) {
    id = Math.round(Math.random() * bookTypesNum) + 3;
    res = await fetch(`https://api.bungomail.com/v0/books/${id}`);
    json = await res.json();
  }
  return json;
}

function isOverlapSentence(left) {
  for (let i = 0; i < leftPositions.length; i++) {
    if (leftPositions[i] - 8.0 < left && left < leftPositions[i] + 8.0) {
      return true;
    }
  }
  return false;
}

function createSentenceElement(sentence) {
  const top = (Math.random() * 60).toFixed(2) + "%";
  let left = Math.random() * 95;

  if (leftPositions) {
    while (isOverlapSentence(left)) {
      left = Math.random() * 95;
    }
  }
  leftPositions.push(left);

  let div = document.createElement("div");
  div.setAttribute("class", "water");
  document.body.appendChild(div);
  div.style.left = left.toFixed(2) + "%";
  div.style.top = top;

  let h2 = document.createElement("h2");
  h2.setAttribute("class", "sentence");
  document.body.appendChild(h2);
  h2.innerHTML = sentence;
  h2.style.left = left.toFixed(2) + "%";
  h2.style.top = top;

  setTimeout(function () {
    document.body.removeChild(div);
    document.body.removeChild(h2);
    leftPositions.splice(leftPositions.indexOf(left), 1);
  }, animationTime);
}

function createSentence() {
  getSentence().then((res) => {
    let sentence = res.book["書き出し"] + "――" + res.book["作品名"];
    createSentenceElement(sentence);
  });
}

/**/

function getPresentLocation() {
  return new Promise((resolve) => {
    let position = {};

    function success(pos) {
      position.lat = pos.coords.latitude;
      position.lon = pos.coords.longitude;
      resolve(position);
    }

    function fail(error) {
      alert("位置情報の取得に失敗しました。エラーコード：" + error.code);
    }

    navigator.geolocation.getCurrentPosition(success, fail);
  });
}

function getWeatherInfo() {
  return new Promise((resolve) => {
    const apiKey = "e746bc30f40c60f304a46eb058138b94"; /* todo 隠蔽すべき */
    const baseURL = "https://api.openweathermap.org/data/2.5/onecall?";

    getPresentLocation().then(async (position) => {
      const query = new URLSearchParams({
        lat: position.lat,
        lon: position.lon,
        lang: "ja",
        appid: apiKey,
      });
      const url = baseURL + query.toString();
      const res = await fetch(url);
      const json = await res.json();
      resolve(json);
    });
  });
}
