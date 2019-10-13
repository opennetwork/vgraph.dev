const FileHound = require('filehound');
const fs = require("fs");
const path = require("path");
const { promisify } = require("util");

FileHound.create()
  .paths("./dist")
  .discard("web_modules")
  .discard("node_modules")
  .ext("js")
  .find()
  .then(
    async filePaths => {
      await Promise.all(
        filePaths.map(
          async filePath => {

            const initialContents = await promisify(fs.readFile)(
              filePath,
              "utf-8"
            );

            const statements = initialContents.match(/(import|export) .+ from ".+";/g);

            if (!statements) {
              return;
            }

            const contents = await statements.reduce(
              async (contentsPromise, statement) => {
                const contents = await contentsPromise;

                const url = statement.match(/"(.+)";/)[1];

                if (url.indexOf(".") === -1) {
                  let replacement = path.relative(path.dirname(filePath), `${__dirname}/dist/web_modules/${url}.js`);
                  if (replacement.indexOf(".") !== -1) {
                    replacement = `./${replacement}`;
                  }
                  return contents.replace(
                    statement,
                    statement.replace(url, replacement)
                  );
                } else {
                  return contents.replace(
                    statement,
                    await getReplacement(url)
                  );
                }

                async function getReplacement(url) {
                  const [stat, indexStat] = await Promise.all([
                    promisify(fs.stat)(path.resolve(path.dirname(filePath), url + ".js")).catch(() => {}),
                    promisify(fs.stat)(path.resolve(path.dirname(filePath), url + "/index.js")).catch(() => {})
                  ]);

                  if (stat && stat.isFile()) {
                    return statement.replace(url, url + ".js");
                  } else if (indexStat && indexStat.isFile()) {
                    return statement.replace(url, url + "/index.js");
                  }
                  return statement;
                }
              },
              Promise.resolve(initialContents)
            );

            await promisify(fs.writeFile)(filePath, contents, "utf-8");

          }
        )
      )
    }
  )
  .then(() => console.log("Complete"))
  .catch(error => console.error(error));

