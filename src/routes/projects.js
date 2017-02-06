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
    method: 'GET',
    path: '/projects/{projectId}',
    config: {
      handler: ProjectsController.view,
      auth: false
    }
  },
  {
    method: 'POST',
    path: '/projects',
    config: {
      handler: ProjectsController.create
    }
  },
  {
    method: 'PUT',
    path: '/projects/{projectId}',
    config: {
      handler: ProjectsController.update
    }
  }
]
