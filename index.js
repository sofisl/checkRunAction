const core = require('@actions/core');
const github = require('@actions/github');

async function createCheckRun(octokit, conclusion, head_sha) {
  checkRun = await octokit.checks.create({
    owner: 'sofisl',
    repo: 'new2dis',
    name: 'conditional check actual run',
    head_sha: head_sha,
    status: 'completed',
    conclusion: conclusion,
    output: {
      title: 'A conditional check run',
      summary: 'Even though your required check did not pass, this will be fine'
    }    
})
return checkRun;
}

try {
  // `who-to-greet` input defined in action metadata file
  const conclusion = core.getInput('conclusion');
  const author = core.getInput('author');
  const myToken = core.getInput('myToken');
  const octokit = github.getOctokit(myToken);
  const head_sha = core.getInput('head_sha');
  console.log("head sha "+head_sha);
  let checkRun;
  if (conclusion === 'success' && author === 'sofisl') {
    checkRun = createCheckRun(octokit, 'success', head_sha);
  }else {
    checkRun = createCheckRun(octokit, 'failure', head_sha);
   }
  core.setOutput("conclusion", checkRun);
} catch (error) {
  core.setFailed(error.message);
}