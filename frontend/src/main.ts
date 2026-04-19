interface FileRecord {
  _id: string;
  fileName: string;
  fileSize: number;
  uploadDate: string;
}

// Use Vite's import.meta.env for environment variables
const apiBaseUrl = import.meta.env.VITE_API_URL || "http://127.0.0.1:5001/api";
const tokenKey = "filehub_token";

const signupForm = document.querySelector<HTMLFormElement>("#signupForm");
const loginForm = document.querySelector<HTMLFormElement>("#loginForm");
const uploadForm = document.querySelector<HTMLFormElement>("#uploadForm");
const refreshButton = document.querySelector<HTMLButtonElement>("#refreshButton");
const filesContainer = document.querySelector<HTMLDivElement>("#filesContainer");
const messageBox = document.querySelector<HTMLDivElement>("#messageBox");
const fileInput = document.querySelector<HTMLInputElement>("#fileInput");

const setMessage = (message: string, type: "success" | "error" = "success"): void => {
  if (!messageBox) {
    return;
  }

  messageBox.textContent = message;
  messageBox.className = `message ${type}`;
};

const getToken = (): string | null => localStorage.getItem(tokenKey);

const saveToken = (token: string): void => {
  localStorage.setItem(tokenKey, token);
};

const request = async <T>(url: string, init?: RequestInit): Promise<T> => {
  const response = await fetch(url, init);
  const data = (await response.json().catch(() => ({}))) as { message?: string } & T;

  if (!response.ok) {
    throw new Error(data.message ?? "Request failed");
  }

  return data;
};

const downloadFile = async (fileId: string, token: string): Promise<void> => {
  const response = await fetch(`${apiBaseUrl}/files/download/${fileId}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!response.ok) {
    const data = (await response.json().catch(() => ({}))) as { message?: string };
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

const renderFiles = (files: FileRecord[]): void => {
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

const loadFiles = async (): Promise<void> => {
  const token = getToken();
  if (!token) {
    renderFiles([]);
    setMessage("Create an account or log in to start using FileHub.");
    return;
  }

  const files = await request<FileRecord[]>(`${apiBaseUrl}/files`, {
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
    const result = await request<{ token: string }>(`${apiBaseUrl}/auth/signup`, {
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
    setMessage((error as Error).message, "error");
  }
});

loginForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(loginForm);

  try {
    const result = await request<{ token: string }>(`${apiBaseUrl}/auth/login`, {
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
    setMessage((error as Error).message, "error");
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
    setMessage((error as Error).message, "error");
  }
});

refreshButton?.addEventListener("click", () => {
  void loadFiles().catch((error: Error) => setMessage(error.message, "error"));
});

filesContainer?.addEventListener("click", async (event) => {
  const target = event.target as HTMLElement;
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
      setMessage((error as Error).message, "error");
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
      setMessage((error as Error).message, "error");
    }
  }
});

void loadFiles().catch((error: Error) => setMessage(error.message, "error"));
