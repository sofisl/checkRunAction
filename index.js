const core = require('@actions/core');
const github = require('@actions/github');

async function getPRAuthor(owner, repo, head_sha, octokit) {
  const prAuthor = (await octokit.repos.listPullRequestsAssociatedWithCommit({
    owner,
    repo,
    commit_sha: head_sha
  })).data[0].user.login;
  console.log(`pr author: ${prAuthor}`);
  return prAuthor;
}

async function createCheckRun(owner, repo, octokit, conclusion, head_sha, testNameToCheckAgainst) {
  const checkRun = await octokit.checks.create({
    owner,
    repo,
    name: `Summary Check for ${testNameToCheckAgainst}`,
    head_sha: head_sha,
    status: 'completed',
    conclusion: conclusion,
    output: {
      title: `A conditional check run for ${testNameToCheckAgainst}`,
      summary: 'This required check passed or failed depening on your summary_check.yml file in this repo'
    }    
  })
  console.log(`check run created: ${createCheckRun}`);
  return checkRun;
}

async function main() {
  try {
    const owner = core.getInput('owner');
    const repo = core.getInput('repo');
    const testName = core.getInput('testName');
    const testNameToCheckAgainst = core.getInput('testNameToCheckAgainst')
    const conclusion = core.getInput('conclusion');
    const myToken = core.getInput('myToken');
    const octokit = github.getOctokit(myToken);
    const testAuthorToCheckAgainst = core.getInput('testAuthorToCheckAgainst');
    const head_sha = core.getInput('pull_request_head_sha');
    const author = await getPRAuthor(owner, repo, head_sha, octokit);
    let checkRun;
    if (conclusion !== 'success' && author === testAuthorToCheckAgainst && testName === testNameToCheckAgainst) {
       checkRun = await createCheckRun(owner, repo, octokit, 'failure', head_sha, testNameToCheckAgainst);
    } else {
       checkRun = await createCheckRun(owner, repo, octokit, 'success', head_sha, testNameToCheckAgainst);     }
    core.setOutput("conclusion", checkRun);
  } catch (error) {
    core.setFailed(error.message);
  }
}

main();
