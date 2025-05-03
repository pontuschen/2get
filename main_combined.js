const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const storage = firebase.storage();

const designerList = document.getElementById("designerList");
const postList = document.getElementById("postList");

// 上傳表單事件
document.getElementById("uploadForm").addEventListener("submit", async e => {
  e.preventDefault();
  const name = document.getElementById("designerName").value;
  const description = document.getElementById("description").value;
  const file = document.getElementById("imageInput").files[0];
  if (!file) return alert("請選擇圖片");

  const storageRef = storage.ref().child("uploads/" + Date.now() + "_" + file.name);
  const snapshot = await storageRef.put(file);
  const url = await snapshot.ref.getDownloadURL();

  await db.collection("posts").add({
    designerName: name,
    description,
    imageUrl: url,
    loveCount: 0,
    fundCount: 0,
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  });

  alert("上傳成功！");
  document.getElementById("uploadForm").reset();
});

// 即時載入資料
db.collection("posts").orderBy("createdAt", "desc").onSnapshot(snapshot => {
  const posts = {};
  postList.innerHTML = "";
  designerList.innerHTML = "";

  snapshot.forEach(doc => {
    const data = doc.data();
    if (!posts[data.designerName]) posts[data.designerName] = [];
    posts[data.designerName].push(data);
  });

  for (const [designer, items] of Object.entries(posts)) {
    designerList.innerHTML += `<span class="designer-tag">${designer}</span> `;
    items.forEach(post => {
      postList.innerHTML += `
        <div class="post">
          <img src="${post.imageUrl}" width="200"><br>
          <strong>${post.designerName}</strong>：${post.description}<br>
          ❤️ ${post.loveCount || 0}　💰 ${post.fundCount || 0}
        </div><hr>`;
    });
  }
});
