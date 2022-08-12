import { graphql } from "@octokit/graphql";
const token = process.env.GIT_EXTENSION_TOKEN;

const graphqlWithAuth = graphql.defaults({
  headers: {
    authorization: `token ${token}`,
  },
});

const QUERY = `
query getUser {
  user(login: "tomoyahiroe") {
    repositories(last: 100) {
      edges {
        node {
          id
          name
          languages(first: 1) {
            edges {
              node {
                id
                name
              }
              size
            }
            totalSize
          }
          primaryLanguage {
            name
          }
        }
      }
    }
  }
}
`;

(async function getInfo() {
  try {
    const { user } = await graphqlWithAuth(QUERY, { login: "tomoyahiroe" });
    // console.log(user);
    return user;
  } catch (err) {
    console.error(err);
  }
})().then((data) => {
  const jsonData = JSON.stringify(data, null, 2);
  // console.log(jsonData);
  let languageArray = [];
  const nodes = data.repositories.edges;
  console.log(nodes.length);
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    if (node.node.primaryLanguage === null) return;
    const usedLanguage = node.node.primaryLanguage.name;
    if (languageArray.indexOf(usedLanguage) === 1) return;
    languageArray.push(usedLanguage);
  }
  console.log("結果は" + languageArray);
  return languageArray;

  //jsonオブジェクトから、情報を抜き取る。
});
