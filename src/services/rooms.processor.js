const fs = require("fs");
const path = require("path");

class Rooms {
  constructor() {
    this.path_ = path.join(__dirname, "../../database");
  }

  createList = () => {
    return new Promise((resolve, reject) => {
      fs.readdir(this.path_, (err, documents) => {
        if (err) return reject(err);

        const docs = [];

        const promises = documents.map((doc) => {
          return new Promise((res, rej) => {
            const docPath = path.join(this.path_, doc);

            fs.stat(docPath, (err, stats) => {
              if (err) {
                return rej("Error reading file: " + err);
              }

              if (stats.isFile()) {
                docs.push({
                  path: `${doc.replace(/\.nes$/i, "")}`,
                  image: `/assets/media/${doc.replace(/\.nes$/i, "")}.jpg`,
                });
              }
              res();
            });
          });
        });

        Promise.all(promises)
          .then(() => {
            docs.sort((a, b) => b.path.localeCompare(a.path));
            resolve(docs)
          })
          .catch(reject);
      });
    });
  };
}

module.exports = Rooms;
