//ユーザのpublicレポジトリに含まれる言語の数を得るファイル

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

export async function getKindsOfLanguage(username) {
  try {
    const { user } = await graphqlWithAuth(QUERY, { login: username });
    // console.log(user);
    return user;
  } catch (err) {
    console.error(err);
  }
  // }.then((data) => {
  //   const jsonData = JSON.stringify(data, null, 2);
  //   // console.log(jsonData);
  //   let languageArray = [];
  //   const nodes = data.repositories.edges;
  //   // console.log(nodes);
  //   for (let i = 0; i < nodes.length; i++) {
  //     const node = nodes[i];
  //     if (node.node.primaryLanguage !== null) {
  //       const usedLanguage = node.node.primaryLanguage.name;
  //       if (languageArray.indexOf(usedLanguage) === -1) {
  //         languageArray.push(usedLanguage);
  //       }
  //     }
  //   }
  //   // console.log(languageArray);
  //   return languageArray.length; //フレームワークも1言語とする。
  // });
}
// exports = { getKindsOfLanguage };
