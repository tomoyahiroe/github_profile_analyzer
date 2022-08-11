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
    login
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

async function getInfo(username) {
  try {
    const { user } = await graphqlWithAuth(QUERY, { login: username });
    console.log(user);
  } catch (err) {
    console.error(err.message);
  }
}

const reader = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
// reader.question("INPUT TARGET USERNAME\n", (inS) => {
//   reader.close();
//   getInfo(inS);
// });
