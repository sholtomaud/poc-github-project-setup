const { Octokit } = require('@octokit/rest');
const yaml = require('js-yaml');
const fs = require('fs');

// GitHub token with necessary permissions
const githubToken = process.env.GH_TOKEN;

// Octokit instance
const octokit = new Octokit({ auth: githubToken });

// Repository information
const owner = 'sholtomaud'; // Replace with your GitHub username
const repo = 'poc-github-project-setup';      // Replace with your repository name

// Project information
const projectName = 'poc-github-project-setup';
const projectBody = 'POC';

async function checkAuthentication() {
    try {
        // Make an authenticated API call to get the authenticated user's information
        const response = await octokit.users.getAuthenticated();

        // Log the response
        console.log('Authenticated User:', response.data);
    } catch (error) {
        console.error('Authentication check failed:', error);
    }
}

// checkAuthentication();

async function getProjectId(projectName) {
    try {
      const response = await octokit.projects.listForRepo({
        owner,
        repo
      });
  
      const project = response.data.find((proj) => proj.name === projectName);
      if (project) {
        return project.id;
      } else {
        throw new Error(`Project not found: ${projectName}`);
      }
    } catch (error) {
      console.error('Error getting project ID:', error);
    }
}

async function createProjectCard() {
    try {
      // Read the content of the YAML file
      const yamlContent = fs.readFileSync('project-plan/card.yaml', 'utf8');
  
      // Parse the YAML content
      const cardData = yaml.load(yamlContent);
  
      // Get the project ID (you'll need to replace with the actual project ID)
      const projectId = await getProjectId(projectName);
  
      // Create a card in the project
      await octokit.projects.createCard({
        column_id: projectId,  // Use the appropriate column ID
        note: cardData.body,   // Use the description from the YAML file
      });
  
      console.log('Card created successfully');
    } catch (error) {
      console.error('Card creation failed:', error);
    }
}

createProjectCard();


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

// createOrUpdateProject();

