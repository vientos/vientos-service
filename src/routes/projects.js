const ProjectsController = require('./../controllers/projects')

module.exports = [
  {
    method: 'GET',
    path: '/projects',
    config: {
      handler: ProjectsController.list,
      auth: false
    }
  },
  {
    method: 'PUT',
    path: '/projects/{projectId}',
    config: {
      handler: ProjectsController.save
    }
  }
]
