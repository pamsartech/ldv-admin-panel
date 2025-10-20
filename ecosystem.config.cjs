module.exports = {
    apps: [
        {
            name: "ldv-admin-prod",
            script: "serve",
            args: "-s dist -l 4173",
            cwd: "/var/www/ldv/prod/ldv-admin-panel",
            env: {
                NODE_ENV: "production"
            },
            env_file: "/var/www/ldv/prod/ldv-admin-panel/.env",
            instances: 1,
            watch: false,
            error_file: "/var/log/pm2/ldv-admin-prod.err.log",
            out_file: "/var/log/pm2/ldv-admin-prod.out.log"
        },
        {
            name: "ldv-admin-dev",
            script: "serve",
            args: "-s dist -l 5173",
            cwd: "/var/www/ldv/dev/ldv-admin-panel",
            env: {
                NODE_ENV: "development"
            },
            env_file: "/var/www/ldv/dev/ldv-admin-panel/.env",
            instances: 1,
            watch: false,
            error_file: "/var/log/pm2/ldv-admin-dev.err.log",
            out_file: "/var/log/pm2/ldv-admin-dev.out.log"
        }
    ]
};
