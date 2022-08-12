import { graphql } from "@octokit/graphql";
import { createObjectCsvWriter } from "csv-writer";
const token = process.env.GIT_EXTENSION_TOKEN;

const graphqlWithAuth = graphql.defaults({
  headers: {
    authorization: `token ${token}`,
  },
});

const QUERY = `
query getUser {
  user(login: "tomoyahiroe") {
    login
    name
    contributionsCollection(to: "2021-12-31T09:23:59", from: "2021-01-01T09:00:00") {
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

  //jsonオブジェクトから、情報を抜き取る。
  const username = data.login;
  const sumContributions =
    data.contributionsCollection.contributionCalendar.totalContributions;
  const amountOfRepository =
    data.contributionsCollection.totalRepositoryContributions;
  console.log({
    username: username,
    amountOfRepository: amountOfRepository,
    sumContributions: sumContributions,
  });
  return {
    username: username,
    amountOfRepository: amountOfRepository,
    sumContributions: sumContributions,
  };
});
