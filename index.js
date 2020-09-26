async function getWeatherInfo() {
  // todo 気象情報をとってくる。気象情報に応じて文章の出現頻度などを変える？
}

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
  let h2 = document.createElement("h2");
  h2.setAttribute("class", "sentence");
  document.body.appendChild(h2);
  h2.innerHTML = sentence;
  h2.style.left = (Math.random() * 98).toFixed(2) + "%";
  h2.style.top = (Math.random() * 60).toFixed(2) + "%";

  setTimeout(function () {
    document.body.removeChild(h2);
  }, animationTime);
}

function createSentence() {
  getSentence().then(res => {
    let sentence = res.book.書き出し + "――" + res.book.姓名;
    createSentenceElement(sentence);
  }).catch(err => {
    console.log(err);
    return;
  });
}

/* 任意設定する変数 */
const bookTypesNum = 100; /* todo 取ってくる本の幅: 1以上101未満の数字 */
const appearanceRate = 700;
const animationTime = 5000; // cssのanimationTimeと一致させる！（こっちはms）

setInterval(createSentence, appearanceRate);


