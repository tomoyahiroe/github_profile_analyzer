import { graphql } from "@octokit/graphql";
import { createObjectCsvWriter } from "csv-writer";
import { getKindsOfLanguage } from "./fetch_languages.js";
import { undergraduates } from "./subjects.js";
const token = process.env.GIT_EXTENSION_TOKEN;

const graphqlWithAuth = graphql.defaults({
  headers: {
    authorization: `token ${token}`,
  },
});

const QUERY = `
query getUser($login: String!) {
  user(login: $login) {
    login
    name
    contributionsCollection(to: "2021-12-31T09:23:59", from: "2021-01-01T09:00:00") {
      contributionCalendar {
        totalContributions
      }
      totalRepositoryContributions
    }
  }
}
`;

async function getInfo(username) {
  try {
    const { user } = await graphqlWithAuth(QUERY, { login: username });
    // console.log(user);
    return user;
  } catch (err) {
    console.error(err);
  }
}

let subjects_data = [];
for (let i = 0; i < undergraduates; i++) {
  const username = undergraduates[i];

  subjects_data += getInfo(username)
    .then((data) => {
      const jsonData = JSON.stringify(data, null, 2);
      console.log(jsonData);

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
    })
    .then((info) => {
      getKindsOfLanguage(info.username)
        .then((data) => {
          const jsonData = JSON.stringify(data, null, 2);
          // console.log(jsonData);
          let languageArray = [];
          const nodes = data.repositories.edges;
          // console.log(nodes);
          for (let i = 0; i < nodes.length; i++) {
            const node = nodes[i];
            if (node.node.primaryLanguage !== null) {
              const usedLanguage = node.node.primaryLanguage.name;
              if (languageArray.indexOf(usedLanguage) === -1) {
                languageArray.push(usedLanguage);
              }
            }
          }
          // console.log(languageArray);
          return languageArray.length; //フレームワークも1言語とする。
        })
        .then((kindsOfLanguage) => {
          // console.log({
          //   username: info.username,
          //   amountOfRepository: info.amountOfRepository,
          //   sumContributions: info.sumContributions,
          //   kindsOfLanguage: kindsOfLanguage,
          // });
          return {
            username: info.username,
            amountOfRepository: info.amountOfRepository,
            sumContributions: info.sumContributions,
            kindsOfLanguage: kindsOfLanguage,
          };
        });
    });
}
