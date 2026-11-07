// The process module: two calls to an outside host (G11) and a credential written into the source (G12).
export async function init() {
  const settings = { client_secret: "not-a-real-secret-0000" };
  const xhr = new XMLHttpRequest();
  xhr.open("GET", "https://cdn.example.org/notes.json");
  return fetch("https://api.example.com/v1/notes", { headers: settings });
}
