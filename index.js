import { graphql } from "@octokit/graphql";
import { createObjectCsvWriter } from "csv-writer";
const token = process.env.GIT_EXTENSION_TOKEN;

const graphqlWithAuth = graphql.defaults({
  headers: {
    authorization: `token ${token}`,
  },
});

// totalRepositoryContributions: レポジトリ数
// promaryLanguage.name: 主要言語
//
const QUERY = `
query getUser {
  user(login: "tomoyahiroe") {
    login
    name
    contributionsCollection {
      contributionCalendar {
        totalContributions
      }
      totalRepositoryContributions
    }
    repositories(last: 5) {
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
  console.log(jsonData);
  // const trimedData = jsonData.trim();
  // const parsedData = JSON.parse(trimedData);
  // console.log(parsedData);
  // for (let i; i < parsedData.length; i++) {
  //   console.log(parsedData[i]);
  // }
  const username = data.login;
  const amountOfRepository =
    data.contributionsCollection.totalRepositoryContributions;
  const primaryLanguage = data.repositories.edges[0].node.primaryLanguage.name;
  console.log({
    username: username,
    amountOfRepository: amountOfRepository,
    primaryLanguage: primaryLanguage,
  });
  return {
    username: username,
    amountOfRepository: amountOfRepository,
    primaryLanguage: primaryLanguage,
  };
});
// })().then((data) => {
//   const username = data.login;
//   const amountOfRepository =
//     data.contributionsCollection.totalRepositoryContributions;
//   const primaryLanguage = data.repositories.edges.languages;
//   console.log({
//     username: username,
//     amountOfRepository: amountOfRepository,
//     primaryLanguage: primaryLanguage,
//   });
//   return {
//     username: username,
//     amountOfRepository: amountOfRepository,
//     primaryLanguage: primaryLanguage,
//   };
// });

// const reader = readline.createInterface({
//   input: process.stdin,
//   output: process.stdout,
// });
// reader.question("INPUT TARGET USERNAME\n", (inS) => {
//   reader.close();
//   getInfo(inS);
// });
