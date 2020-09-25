async function getSentence() {
  const id = Math.round(Math.random() * 100) + 1; /* todo 取ってくる本の幅: 1以上101未満の数字 */
  const res = await fetch(`https://api.bungomail.com/v0/books/${id}`);
  const json = await res.json();

  return json
}

function createSentenceElement() {
  getSentence().then(res => {
    if (res.book.書き出し === undefined || res.book.書き出し === "" || res.book.姓名 === undefined) {
      return;
    }
    let sentence = res.book.書き出し + "――" + res.book.姓名;

    let h2 = document.createElement("h2");
    h2.setAttribute("class", "sentence");
    document.body.appendChild(h2);
    h2.innerHTML = sentence;
    h2.style.left = (Math.random() * 98).toFixed(2) + "%";
    h2.style.top = (Math.random() * 60).toFixed(2) + "%"

    setTimeout(function () {
      document.body.removeChild(h2);
    }, animationTime);
  }).catch(err => {
    console.log(err);
    return;
  });
}

const appearanceRate = 700;
const animationTime = 5000; // cssのanimationTimeと一致させる！（こっちはms）

setInterval(createSentenceElement, appearanceRate);


