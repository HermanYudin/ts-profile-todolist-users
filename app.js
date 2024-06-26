let taskInput = document.getElementById("new-task");
let addButton = document.getElementsByTagName("button")[0];
let incompleteTaskHolder = document.getElementById("incompleted-tasks");
let completedTasksHolder = document.getElementById("completed-tasks");

let createNewTaskElement = function (taskString) {
  let listItem = document.createElement("li");
  let checkBox = document.createElement("input");
  let label = document.createElement("label");
  let editInput = document.createElement("input");
  let editButton = document.createElement("button");
  let deleteButton = document.createElement("button");
  let deleteButtonImg = document.createElement("img");

  label.innerText = taskString;
  label.className = "task";
  checkBox.type = "checkbox";
  editInput.type = "text";
  editInput.className = "task";

  editButton.innerText = "Edit";
  editButton.className = "edit";

  deleteButton.className = "delete";
  deleteButtonImg.src = "./svg/remove.svg";
  deleteButton.appendChild(deleteButtonImg);

  listItem.appendChild(checkBox);
  listItem.appendChild(label);
  listItem.appendChild(editInput);
  listItem.appendChild(editButton);
  listItem.appendChild(deleteButton);
  return listItem;
};

let addTask = function () {
  if (!taskInput.value) return;
  let listItem = createNewTaskElement(taskInput.value);
  incompleteTaskHolder.appendChild(listItem);
  bindTaskEvents(listItem, taskCompleted);

  taskInput.value = "";
};

let editTask = function () {
  let listItem = this.parentNode;

  let editInput = listItem.querySelector("input[type=text]");
  let label = listItem.querySelector("label");
  let editBtn = listItem.querySelector(".edit");
  let containsClass = listItem.classList.contains("editMode");
  if (containsClass) {
    label.innerText = editInput.value;
    editBtn.innerText = "Edit";
  } else {
    editInput.value = label.innerText;
    editBtn.innerText = "Save";
  }
  listItem.classList.toggle("editMode");
};

let deleteTask = function () {
  let listItem = this.parentNode;
  let ul = listItem.parentNode;
  ul.removeChild(listItem);
};

let taskCompleted = function () {
  let listItem = this.parentNode;
  completedTasksHolder.appendChild(listItem);
  bindTaskEvents(listItem, taskIncomplete);
};

let taskIncomplete = function () {
  let listItem = this.parentNode;
  incompleteTaskHolder.appendChild(listItem);
  bindTaskEvents(listItem, taskCompleted);
};

addButton.addEventListener("click", addTask);

let bindTaskEvents = function (taskListItem, checkBoxEventHandler) {
  let checkBox = taskListItem.querySelector("input[type=checkbox]");
  let editButton = taskListItem.querySelector("button.edit");
  let deleteButton = taskListItem.querySelector("button.delete");

  editButton.addEventListener("click", editTask);
  deleteButton.addEventListener("click", deleteTask);
  checkBox.onchange = checkBoxEventHandler;
};

for (let i = 0; i < incompleteTaskHolder.children.length; i++) {
  bindTaskEvents(incompleteTaskHolder.children[i], taskCompleted);
}

for (let i = 0; i < completedTasksHolder.children.length; i++) {
  bindTaskEvents(completedTasksHolder.children[i], taskIncomplete);
}

// -----------POSTS---------------

const postsUrl =
  "https://jsonplaceholder.typicode.com/comments?_start=0&_limit=5";
const filterById = document.querySelector(".id-filter");
const filterByEmail = document.querySelector(".email-filter");
const usersAndPostsSection = document.querySelector(
  ".users-and-posts_container"
);

let posts = [];

async function getPosts() {
  const res = await fetch(postsUrl);
  const data = await res.json();
  posts = data;
  renderPosts(posts);
}

function renderPost(post) {
  const postDiv = document.createElement("div");

  const postId = document.createElement("span");
  postId.classList.add("post_id");
  postId.innerText = "User id: " + post.id;

  const postAuthor = document.createElement("h4");
  postAuthor.classList.add("post_author");
  postAuthor.innerText = "Written by ";

  const postEmail = document.createElement("span");
  postEmail.classList.add("post_email");
  postEmail.innerText = post.email;

  postEmail.addEventListener("click", () => {
    const newUrl = `https://jsonplaceholder.typicode.com/comments/${post.id}`;
    window.open(newUrl, "_blank");
  });

  const postBody = document.createElement("div");
  postBody.innerText = post.body;

  postDiv.appendChild(postId);
  postDiv.appendChild(postAuthor);
  postAuthor.appendChild(postEmail);
  postDiv.appendChild(postBody);

  postDiv.classList.add("post");

  return postDiv;
}

async function renderPosts(posts = []) {
  const section = document.querySelector(".users-and-posts_container");
  section.innerHTML = "";

  posts.forEach((post) => {
    const postDiv = renderPost(post);
    section.appendChild(postDiv);
  });
}

filterById.addEventListener("click", async () => {
  const filteredPosts = posts.slice().sort((a, b) => a.id - b.id);
  renderPosts(filteredPosts);
});

filterByEmail.addEventListener("click", async () => {
  const filteredPosts = posts
    .slice()
    .sort((a, b) => a.email.localeCompare(b.email));
  renderPosts(filteredPosts);
});

getPosts();
