const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const storage = firebase.storage();

const designerList = document.getElementById("designerList");
const postList = document.getElementById("postList");

document.getElementById("uploadForm").addEventListener("submit", async e => {
  e.preventDefault();
  const name = document.getElementById("designerName").value.trim();
  const description = document.getElementById("description").value.trim();
  const file = document.getElementById("imageInput").files[0];
  if (!file || !name || !description) return alert("請填寫所有欄位");

  try {
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
  } catch (error) {
    alert("上傳失敗：" + error.message);
    console.error(error);
  }
});

db.collection("posts").orderBy("createdAt", "desc").onSnapshot(snapshot => {
  const posts = {};
  postList.innerHTML = "";
  designerList.innerHTML = "";

  snapshot.forEach(doc => {
    const data = doc.data();
    if (!data.imageUrl || !data.designerName) return;
    if (!posts[data.designerName]) posts[data.designerName] = [];
    posts[data.designerName].push(data);
  });

  for (const [designer, items] of Object.entries(posts)) {
    designerList.innerHTML += `<span class="designer-tag">${designer}</span> `;
    items.forEach(post => {
      postList.innerHTML += `
        <div class="post">
          <img src="${post.imageUrl}" width="200" onerror="this.style.display='none';"><br>
          <strong>${post.designerName}</strong>：${post.description}<br>
          ❤️ ${post.loveCount || 0}　💰 ${post.fundCount || 0}
        </div><hr>`;
    });
  }
});
