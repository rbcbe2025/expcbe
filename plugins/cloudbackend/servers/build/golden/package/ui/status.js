// The status component: a call to the platform's own API, which G11 allows.
export class CA_Status {
  load() { return fetch("https://api.cloudbackend.com/v1/sessions"); }
}
