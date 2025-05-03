
const firebaseConfig = {
  apiKey: "AIzaSyDqMfXPUaks_xU-X7an8KOn47B79sw9W8I",
  authDomain: "the2get.firebaseapp.com",
  projectId: "the2get",
  storageBucket: "the2get.firebasestorage.app",
  messagingSenderId: "619520361854",
  appId: "1:619520361854:web:cd94b73559cebe9cdc9f2f",
  measurementId: "G-TYEB6QFR0W"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const storage = firebase.storage();

function upload() {
  const designer = document.getElementById("designer").value;
  const description = document.getElementById("description").value;
  const file = document.getElementById("imageInput").files[0];
  if (!designer || !description || !file) return alert("請填寫所有欄位並選擇圖片");

  const filename = "uploads/" + Date.now() + "_" + file.name;
  const ref = storage.ref(filename);
  ref.put(file).then(snapshot => {
    return snapshot.ref.getDownloadURL();
  }).then(url => {
    return db.collection("posts").add({
      designer,
      description,
      imageUrl: url,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });
  }).then(() => {
    alert("上傳成功");
    location.reload();
  }).catch(err => {
    console.error(err);
    alert("上傳失敗");
  });
}

// 顯示投稿牆
db.collection("posts").orderBy("timestamp", "desc").limit(20).onSnapshot(snapshot => {
  const container = document.getElementById("gallery");
  container.innerHTML = "";
  snapshot.forEach(doc => {
    const data = doc.data();
    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `
      <div class="designer">${data.designer}</div>
      <div class="desc">${data.description}</div>
      <img src="${data.imageUrl}" alt="設計圖片"/>
    `;
    container.appendChild(div);
  });
});
