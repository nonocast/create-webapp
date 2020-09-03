module.exports = {
  apps: [{
    name: 'create-webapp',
    script: 'bundle.js',

    instances: 'max',
    autorestart: false,
    watch: false,
    max_memory_restart: '1G',

    error_file: '/dev/null',
    out_file: '/dev/null',
    log_file: '/dev/null',
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production'
    }
  }]
};
