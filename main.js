const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

const designerList = document.getElementById("designerList");
const postList = document.getElementById("postList");

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
    designerList.innerHTML += `<div><strong>${designer}</strong></div>`;
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
