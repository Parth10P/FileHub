const apiBaseUrl = "/api";
const tokenKey = "filehub_token";
const signupForm = document.querySelector("#signupForm");
const loginForm = document.querySelector("#loginForm");
const uploadForm = document.querySelector("#uploadForm");
const refreshButton = document.querySelector("#refreshButton");
const filesContainer = document.querySelector("#filesContainer");
const messageBox = document.querySelector("#messageBox");
const fileInput = document.querySelector("#fileInput");
const setMessage = (message, type = "success") => {
  if (!messageBox) {
    return;
  }
  messageBox.textContent = message;
  messageBox.className = `message ${type}`;
};
const getToken = () => localStorage.getItem(tokenKey);
const saveToken = (token) => {
  localStorage.setItem(tokenKey, token);
};
const request = async (url, init) => {
  const response = await fetch(url, init);
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message ?? "Request failed");
  }
  return data;
};
const downloadFile = async (fileId, token) => {
  const response = await fetch(`${apiBaseUrl}/files/download/${fileId}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.message ?? "Download failed");
  }
  const blob = await response.blob();
  const objectUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = objectUrl;
  link.download = "";
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(objectUrl);
};
const renderFiles = (files) => {
  if (!filesContainer) {
    return;
  }
  if (files.length === 0) {
    filesContainer.innerHTML = "<p>No files uploaded yet.</p>";
    return;
  }
  filesContainer.innerHTML = files
    .map(
      (file) => `
        <article class="file-item">
          <div class="file-meta">
            <strong>${file.fileName}</strong>
            <span>${new Date(file.uploadDate).toLocaleString()}</span>
            <span>${Math.ceil(file.fileSize / 1024)} KB</span>
          </div>
          <div class="file-actions">
            <button type="button" data-action="download" data-id="${file._id}">Download</button>
            <button type="button" class="danger" data-action="delete" data-id="${file._id}">Delete</button>
          </div>
        </article>
      `
    )
    .join("");
};
const loadFiles = async () => {
  const token = getToken();
  if (!token) {
    renderFiles([]);
    setMessage("Create an account or log in to start using FileHub.");
    return;
  }
  const files = await request(`${apiBaseUrl}/files`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  renderFiles(files);
};
signupForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(signupForm);
  try {
    const result = await request(`${apiBaseUrl}/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: formData.get("name"),
        email: formData.get("email"),
        password: formData.get("password")
      })
    });
    saveToken(result.token);
    setMessage("Account created successfully.");
    signupForm.reset();
    await loadFiles();
  } catch (error) {
    setMessage(error.message, "error");
  }
});
loginForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(loginForm);
  try {
    const result = await request(`${apiBaseUrl}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: formData.get("email"),
        password: formData.get("password")
      })
    });
    saveToken(result.token);
    setMessage("Logged in successfully.");
    loginForm.reset();
    await loadFiles();
  } catch (error) {
    setMessage(error.message, "error");
  }
});
uploadForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const token = getToken();
  const selectedFile = fileInput?.files?.[0];
  if (!token) {
    setMessage("Please log in before uploading files.", "error");
    return;
  }
  if (!selectedFile) {
    setMessage("Please choose a file first.", "error");
    return;
  }
  const formData = new FormData();
  formData.append("file", selectedFile);
  try {
    await request(`${apiBaseUrl}/files/upload`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: formData
    });
    setMessage("File uploaded successfully.");
    uploadForm.reset();
    await loadFiles();
  } catch (error) {
    setMessage(error.message, "error");
  }
});
refreshButton?.addEventListener("click", () => {
  void loadFiles().catch((error) => setMessage(error.message, "error"));
});
filesContainer?.addEventListener("click", async (event) => {
  const target = event.target;
  const action = target.dataset.action;
  const fileId = target.dataset.id;
  const token = getToken();
  if (!action || !fileId || !token) {
    return;
  }
  if (action === "download") {
    try {
      await downloadFile(fileId, token);
    } catch (error) {
      setMessage(error.message, "error");
    }
    return;
  }
  if (action === "delete") {
    try {
      await request(`${apiBaseUrl}/files/${fileId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setMessage("File deleted successfully.");
      await loadFiles();
    } catch (error) {
      setMessage(error.message, "error");
    }
  }
});
void loadFiles().catch((error) => setMessage(error.message, "error"));
