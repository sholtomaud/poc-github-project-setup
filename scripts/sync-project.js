const { Octokit } = require('@octokit/rest');

// GitHub token with necessary permissions
const githubToken = process.env.PROJECT_TOKEN;

// Octokit instance
const octokit = new Octokit({ auth: githubToken });

// Repository information
const owner = 'sholtomaud'; // Replace with your GitHub username
const repo = 'poc-github-project-setup';      // Replace with your repository name

// Project information
const projectName = 'poc-github-project-setup';
const projectBody = 'POC';

async function createOrUpdateProject() {
  try {
    // Get existing projects
    const projects = await octokit.projects.listForRepo({ owner, repo });

    // Check if the project already exists
    const existingProject = projects.data.find(project => project.name === projectName);

    if (existingProject) {
      // Update the existing project
      await octokit.projects.update({
        project_id: existingProject.id,
        name: projectName,
        body: projectBody,
      });

      console.log('Project updated successfully.');
    } else {
      // Create a new project
      await octokit.projects.createForRepo({ owner, repo, name: projectName, body: projectBody });

      console.log('Project created successfully.');
    }
  } catch (error) {
    console.error('An error occurred:', error);
    process.exit(1);
  }
}

createOrUpdateProject();
