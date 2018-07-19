export const restService = (() => {
  const API_ADDRESS = "http://localhost:8080";

  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json"
  };

  const get = uri =>
    new Promise((resolve, reject) => {
      fetch(`${API_ADDRESS}/${uri}`, {
        method: "GET",
        headers
      }).then(
        response => resolve(response.json()),
        error => reject(error.json())
      );
    });

  const post = (uri, body) =>
    new Promise((resolve, reject) => {
      fetch(`${API_ADDRESS}/${uri}`, {
        method: "POST",
        headers,
        body: JSON.stringify(body)
      }).then(
        response => resolve(response.json()),
        error => reject(error.json())
      );
    });

  const put = (uri, body) =>
    new Promise((resolve, reject) => {
      fetch(`${API_ADDRESS}/${uri}`, {
        method: "PUT",
        headers,
        body: JSON.stringify(body)
      }).then(
        response => resolve(response.json()),
        error => reject(error.json())
      );
    });

  const remove = uri =>
    new Promise((resolve, reject) => {
      fetch(`${API_ADDRESS}/${uri}`, {
        method: "DELETE",
        headers
      }).then(
        response => resolve(response.json()),
        error => reject(error.json())
      );
    });

    return {
        get,
        post,
        put,
        remove
    }
})();
