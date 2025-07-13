# PM2 Commands Guide for Egypt Express TVL

## Quick Start

### 1. First Time Setup
```bash
# Make the setup script executable and run it
chmod +x pm2-setup.sh
./pm2-setup.sh
```

### 2. Using NPM Scripts (Recommended)
```bash
# Start in production mode
npm run pm2:start:prod

# Start in development mode
npm run pm2:start:dev

# Start both configurations
npm run pm2:start

# Stop all PM2 processes
npm run pm2:stop

# Restart all PM2 processes
npm run pm2:restart

# Delete all PM2 processes
npm run pm2:delete

# View logs
npm run pm2:logs

# Monitor processes
npm run pm2:monit

# Check status
npm run pm2:status
```

## Direct PM2 Commands

### Starting Applications
```bash
# Start production app
pm2 start ecosystem.config.cjs --env production

# Start development app
pm2 start ecosystem.config.cjs --only egypt-express-tvl-dev

# Start both apps
pm2 start ecosystem.config.cjs
```

### Managing Applications
```bash
# List all processes
pm2 list
pm2 status

# Restart specific app
pm2 restart egypt-express-tvl
pm2 restart egypt-express-tvl-dev

# Stop specific app
pm2 stop egypt-express-tvl
pm2 stop egypt-express-tvl-dev

# Delete specific app
pm2 delete egypt-express-tvl
pm2 delete egypt-express-tvl-dev

# Delete all apps
pm2 delete all
```

### Monitoring and Logs
```bash
# View logs for all apps
pm2 logs

# View logs for specific app
pm2 logs egypt-express-tvl
pm2 logs egypt-express-tvl-dev

# Monitor processes in real-time
pm2 monit

# View detailed information
pm2 show egypt-express-tvl
pm2 show egypt-express-tvl-dev
```

### Advanced Commands
```bash
# Reload application (zero-downtime restart)
pm2 reload egypt-express-tvl

# Scale application to multiple instances
pm2 scale egypt-express-tvl 2

# Save current PM2 configuration
pm2 save

# Restore saved configuration
pm2 resurrect

# Generate startup script
pm2 startup

# Install PM2 startup script
pm2 startup systemd
```

## Environment Variables

The application uses the following environment variables:

- `NODE_ENV`: Set to 'development' or 'production'
- `PORT`: Application port (default: 8080)
- `DATABASE_URL`: PostgreSQL connection string
- `SESSION_SECRET`: Session encryption key

## Log Files

Logs are stored in the `logs/` directory:
- `combined.log` / `combined-dev.log`: Combined logs
- `out.log` / `out-dev.log`: Standard output
- `err.log` / `err-dev.log`: Error logs

## Troubleshooting

### Common Issues

1. **Port already in use**
   ```bash
   # Check what's using the port
   lsof -i :8080
   # Kill the process
   kill -9 <PID>
   ```

2. **PM2 process not starting**
   ```bash
   # Check PM2 logs
   pm2 logs
   # Check application logs
   tail -f logs/err.log
   ```

3. **Build errors**
   ```bash
   # Clean and rebuild
   rm -rf dist/
   npm run build
   ```

4. **Database connection issues**
   - Check `DATABASE_URL` environment variable
   - Ensure database server is running
   - Check network connectivity

### Reset Everything
```bash
# Stop and delete all PM2 processes
pm2 delete all

# Clear PM2 logs
pm2 flush

# Restart fresh
npm run pm2:start:prod
```

## Production Deployment

For production deployment:

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Start with production environment**
   ```bash
   npm run pm2:start:prod
   ```

3. **Save PM2 configuration**
   ```bash
   pm2 save
   ```

4. **Setup PM2 to start on boot**
   ```bash
   pm2 startup
   # Follow the instructions provided
   ```

## Development Workflow

For development:

1. **Start in development mode**
   ```bash
   npm run pm2:start:dev
   ```

2. **Monitor logs during development**
   ```bash
   pm2 logs egypt-express-tvl-dev --lines 100
   ```

3. **Restart after code changes**
   ```bash
   pm2 restart egypt-express-tvl-dev
   ```