module.exports = {
    /**
     * Application configuration section
     * http://pm2.keymetrics.io/docs/usage/application-declaration/
     */
    apps: [
        // First application
        {
            name: 'gc-server',
            script: 'start.js',
            env: {
                "PORT": 8083,
                "NODE_ENV": "development"
            },
            env_production: {
                "PORT": 8083,
                "NODE_ENV": "production",
            }
        },
    ],
};
