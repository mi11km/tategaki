/* 任意設定する変数 */
const bookTypesNum = 100; /* todo 取ってくる本の幅: 1以上101未満の数字 */
const appearanceRate = 1000;
const animationTime = 8000; // cssのanimationTimeと一致させる！（こっちはms）

getWeatherInfo().then((res) => {
  console.log(res);
});

setInterval(createSentence, appearanceRate);

async function getSentence() {
  const id = Math.round(Math.random() * bookTypesNum) + 3;
  const res = await fetch(`https://api.bungomail.com/v0/books/${id}`);
  const json = await res.json();

  if (!"書き出し" in json.book || !"姓名" in json.book) {
    return;
  }
  return json;
}

function createSentenceElement(sentence) {
  let left = Math.random() * 98;
  const leftDiv = (left - 2.0).toFixed(2) + "%";
  left = left.toFixed(2) + "%";
  const top = (Math.random() * 60).toFixed(2) + "%";

  let div = document.createElement("div");
  div.setAttribute("class", "water");
  document.body.appendChild(div);
  div.style.left = leftDiv;
  div.style.top = top;

  let h2 = document.createElement("h2");
  h2.setAttribute("class", "sentence");
  document.body.appendChild(h2);
  h2.innerHTML = sentence;
  h2.style.left = left;
  h2.style.top = top;

  setTimeout(function () {
    document.body.removeChild(div);
    document.body.removeChild(h2);
  }, animationTime);
}

function createSentence() {
  getSentence()
    .then((res) => {
      let sentence = res.book.書き出し + "――" + res.book.姓名;
      createSentenceElement(sentence);
    })
    .catch((err) => {
      console.log(err);
      return;
    });
}

/**/

const getPresentLocation = new Promise((resolve) => {
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

async function getWeatherInfo() {
  const apiKey = "e746bc30f40c60f304a46eb058138b94"; /* todo 隠蔽すべき */
  const baseURL = "https://api.openweathermap.org/data/2.5/onecall?";

  // getPresentLocation.then((position) => {
  //   console.log(position.lat);
  // });

  const query = new URLSearchParams({
    // 東京駅　todo 現在位置にする
    lat: 35.681236,
    lon: 139.767125,
    lang: "ja",
    appid: apiKey,
  });
  const url = baseURL + query.toString();

  const res = await fetch(url);
  const json = await res.json();
  return json;
}
