module.exports = {
  apps: [{
    name: 'beautygen',
    cwd: '/home/ubuntu/beautygen',
    script: 'npm',
    args: 'start',
    env: {
      PORT: 3005,
      NODE_ENV: 'production'
    }
  }]
}
