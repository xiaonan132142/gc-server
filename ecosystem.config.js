module.exports = {
    /**
     * Application configuration section
     * http://pm2.keymetrics.io/docs/usage/application-declaration/
     */
    apps: [
        // First application
        {
            name: 'gbt-server',
            script: 'start.js',
            env: {
                "PORT": 6666,
                "NODE_ENV": "development"
            },
            env_production: {
                "PORT": 6666,
                "NODE_ENV": "production",
            }
        },
    ],
};
