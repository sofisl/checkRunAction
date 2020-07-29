const core = require('@actions/core');
const github = require('@actions/github');

try {
  // `who-to-greet` input defined in action metadata file
  const conclusion = core.getInput('conclusion');
  const author = core.getInput('author');
  const myToken = core.getInput('myToken');
  const octokit = github.getOctokit(myToken);
  const checkRun;
  if (conclusion === 'success' && author === 'sofisl') {
    checkRun = await octokit.checks.create({
      owner: 'sofisl',
      repo: 'new2dis',
      name: 'conditional check actual run',
      head_sha: core.getInput('head_sha'),
      status: 'completed',
      conclusion: 'success',
    });
  } else {
    checkRun = await octokit.checks.create({
      owner: 'sofisl',
      repo: 'new2dis',
      name: 'conditional check actual run',
      head_sha: core.getInput('head_sha'),
      status: 'completed',
      conclusion: 'failure',
  })
  }
  core.setOutput("conclusion", checkRun);

} catch (error) {
  core.setFailed(error.message);
}