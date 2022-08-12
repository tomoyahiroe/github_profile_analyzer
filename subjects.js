import { graphql } from "@octokit/graphql";
const token = process.env.GIT_EXTENSION_TOKEN;

const graphqlWithAuth = graphql.defaults({
  headers: {
    authorization: `token ${token}`,
  },
});

const QUERY = `
query MyQuery {
  search(query: "undergraduates", type: USER, last: 100) {
    userCount
    nodes {
      ... on User {
        login
      }
    }
  }
}
`;

async function getSubjects() {
  try {
    const { search } = await graphqlWithAuth(QUERY);

    return search;
  } catch (err) {
    console.error(err.message);
  }
}

const undergraduates = getSubjects().then((user) => {
  // console.log(JSON.stringify(user, null, 1));
  let subjects = [];
  let clean_subjects = [];
  for (let i = 0; i < user.nodes.length; i++) {
    subjects.push(user.nodes[i].login);
  }
  for (let i = 0; i < subjects.length; i++) {
    if (subjects[i]) {
      clean_subjects.push(subjects[i]);
    }
  }
  return clean_subjects;
});

export { undergraduates };
