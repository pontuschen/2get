const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const storage = firebase.storage();

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
