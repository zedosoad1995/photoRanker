import fs from "fs";
import path from "path";
import fetch from "node-fetch";
import FormData from "form-data";

const HOST = `http://localhost:8000`;

(async () => {
  const res = await fetch(`${HOST}/api/auth/login`, {
    method: "POST",
    body: JSON.stringify({
      email: "user1@gmail.com",
      password: "password",
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const cookie = res.headers.get("set-cookie");
  console.log(cookie);

  const filePaths = fs.readdirSync(path.resolve(__dirname, "data"));

  for (const filepath of filePaths) {
    const formData = new FormData();
    formData.append("image", fs.createReadStream(path.resolve(__dirname, "data", filepath)));

    await fetch(`${HOST}/api/pictures`, {
      method: "POST",
      body: formData,
      headers: {
        "Content-Type": `multipart/form-data; boundary=${formData.getBoundary()}`,
        cookie: cookie!,
      },
    });
  }
})();
