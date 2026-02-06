# Deployment

## Self-Hosting

### Prerequisites
- Node.js 18+ and npm
- OpenClaw Gateway running and accessible
- (Optional) Reverse proxy (nginx, Caddy, Tailscale Serve)

### Production Build

```bash
# Clone repository
git clone https://github.com/robbyczgw-cla/opencami.git
cd opencami

# Install dependencies
npm install

# Build for production
npm run build
```

The build output will be in `.output/` directory.

### Environment Variables

Create a `.env` file (or set in systemd service):

#### Required
```bash
CLAWDBOT_GATEWAY_URL=ws://127.0.0.1:18789
CLAWDBOT_GATEWAY_TOKEN=your_gateway_token_here
```

#### Optional
```bash
# File explorer root directory
FILES_ROOT=/path/to/workspace

# OpenAI API key for LLM features (smart titles, smart follow-ups)
OPENAI_API_KEY=sk-...
```

### Running in Production

#### Option 1: Direct Node.js
```bash
node .output/server/index.mjs
```

#### Option 2: PM2 (Process Manager)
```bash
npm install -g pm2
pm2 start .output/server/index.mjs --name opencami
pm2 save
pm2 startup  # Enable auto-start on boot
```

#### Option 3: systemd Service

Create `/etc/systemd/system/opencami.service`:

```ini
[Unit]
Description=OpenCami Web Client
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/opt/opencami
Environment="CLAWDBOT_GATEWAY_URL=ws://127.0.0.1:18789"
Environment="CLAWDBOT_GATEWAY_TOKEN=your_token_here"
Environment="FILES_ROOT=/home/user/workspace"
Environment="NODE_ENV=production"
ExecStart=/usr/bin/node .output/server/index.mjs
Restart=on-failure
RestartSec=5s

[Install]
WantedBy=multi-user.target
```

Enable and start:
```bash
sudo systemctl daemon-reload
sudo systemctl enable opencami
sudo systemctl start opencami
sudo systemctl status opencami
```

View logs:
```bash
sudo journalctl -u opencami -f
```

## Reverse Proxy

### nginx

```nginx
server {
    listen 80;
    server_name opencami.example.com;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        
        # WebSocket support
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Timeout for SSE
        proxy_read_timeout 300s;
        proxy_connect_timeout 75s;
    }
}
```

For HTTPS with Let's Encrypt:
```bash
sudo certbot --nginx -d opencami.example.com
```

### Caddy

```caddy
opencami.example.com {
    reverse_proxy localhost:3001
}
```

Caddy handles HTTPS automatically.

### Tailscale Serve

Expose OpenCami on your Tailnet:

```bash
tailscale serve --bg --https=443 --set-path=/ http://localhost:3001
```

Or with a custom hostname:
```bash
tailscale serve --bg --https=443 --hostname=opencami http://localhost:3001
```

Access via: `https://opencami.your-tailnet.ts.net`

## Environment Variable Reference

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `CLAWDBOT_GATEWAY_URL` | ✅ | — | OpenClaw Gateway WebSocket URL (e.g., `ws://127.0.0.1:18789`) |
| `CLAWDBOT_GATEWAY_TOKEN` | ✅ | — | Authentication token for Gateway |
| `FILES_ROOT` | ❌ | — | Root directory for file explorer. If not set, file explorer is disabled. |
| `OPENAI_API_KEY` | ❌ | — | OpenAI API key for LLM features (smart titles, smart follow-ups). Falls back to manual entry in Settings. |
| `NODE_ENV` | ❌ | `development` | Set to `production` for optimized builds |
| `PORT` | ❌ | `3001` | HTTP server port |

## Docker (Experimental)

Dockerfile is not yet provided. Contributions welcome!

Recommended approach until official image:
```bash
# Build
docker run --rm -v $(pwd):/app -w /app node:18 npm install && npm run build

# Run
docker run -d \
  -p 3001:3001 \
  -e CLAWDBOT_GATEWAY_URL=ws://host.docker.internal:18789 \
  -e CLAWDBOT_GATEWAY_TOKEN=your_token \
  -v $(pwd)/.output:/app/.output \
  node:18 \
  node /app/.output/server/index.mjs
```

## Monitoring

### Health Check Endpoint

OpenCami doesn't expose a dedicated `/health` endpoint yet. Monitor the main page:

```bash
curl -f http://localhost:3001 || exit 1
```

### Process Monitoring

With systemd:
```bash
systemctl is-active opencami
```

With PM2:
```bash
pm2 status opencami
```

## Troubleshooting

### WebSocket Connection Failed
- Check `CLAWDBOT_GATEWAY_URL` is correct
- Ensure Gateway is running: `openclaw gateway status`
- Test Gateway directly: `wscat -c ws://127.0.0.1:18789`

### File Explorer Not Showing
- Set `FILES_ROOT` environment variable
- Ensure the path exists and is readable
- Check server logs for permission errors

### LLM Features Not Working
- Set `OPENAI_API_KEY` or enter manually in Settings
- Check API key is valid: `curl https://api.openai.com/v1/models -H "Authorization: Bearer $OPENAI_API_KEY"`
- Model fallback: gpt-4.1-nano → gpt-4o-mini → gpt-3.5-turbo

### Service Worker Update Loop
- Clear browser cache and service worker
- Hard refresh: Ctrl+Shift+R (Windows/Linux) or Cmd+Shift+R (Mac)
- In DevTools → Application → Service Workers → Unregister

## Updates

### Pull Latest Changes
```bash
cd /opt/opencami
git pull origin main
npm install
npm run build
sudo systemctl restart opencami
```

### Upstream Sync
If you forked OpenCami and want to pull upstream changes:
```bash
git remote add upstream https://github.com/robbyczgw-cla/opencami.git
git fetch upstream
git merge upstream/main
```
