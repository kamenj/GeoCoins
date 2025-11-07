# Cloudflare Tunnel Configuration for Docker

The Cloudflare tunnel in Docker uses the existing configuration files from:
`GeoCoins/bin/kkk.kaminooo.com/`

## Files Mounted:
- `kkk.yml` → Tunnel configuration
- `b75605a4-4c9f-442e-ade7-d582a9b3f5e1.json` → Credentials
- `cert.pem` → Certificate

## Important: Update kkk.yml for Docker

**Original (localhost):**
```yaml
ingress:
  - hostname: kkk.kaminooo.com
    service: http://localhost:8081  # ← Won't work in Docker!
```

**For Docker (container hostname):**
```yaml
ingress:
  - hostname: kkk.kaminooo.com
    service: http://frontend:8081  # ← Use container name!
```

## Create a Docker-specific config (Optional):

You can create a separate `kkk-docker.yml` with Docker network hostnames:

```yaml
tunnel: b75605a4-4c9f-442e-ade7-d582a9b3f5e1
credentials-file: /etc/cloudflared/credentials.json
ingress:
  - hostname: kkk.kaminooo.com
    service: http://frontend:8081
  - service: http_status:404
```

Then update docker-compose.base.yml:
```yaml
volumes:
  - ../bin/kkk.kaminooo.com/kkk-docker.yml:/etc/cloudflared/config.yml:ro
```

## Files NOT Copied:

The following files in `docker/` folder are NO LONGER NEEDED:
- ❌ `cloudflare-config.yml` (use original from bin/kkk.kaminooo.com/)
- ❌ `tunnel-credentials.json` (use original)

You can delete them - Docker mounts the originals directly!
