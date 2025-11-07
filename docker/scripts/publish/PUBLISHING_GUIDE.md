# Publishing GeoCoins Images to GitHub Container Registry

## One-Time Setup (First Time Only)

### 1. Create GitHub Personal Access Token

1. Go to: https://github.com/settings/tokens
2. Click "Generate new token (classic)"
3. Name it: `GeoCoins Docker Publishing`
4. Select scopes:
   - ✅ `write:packages` (to publish)
   - ✅ `read:packages` (to download)
   - ✅ `delete:packages` (to manage)
5. Click "Generate token"
6. **COPY THE TOKEN** (you won't see it again!)

### 2. Login to GitHub Container Registry

Open terminal and run:
```bash
docker login ghcr.io -u kamenj
```

When prompted for password, paste your **Personal Access Token** (not your GitHub password).

You should see: `Login Succeeded`

---

## Publishing New Versions

### Every time you want to release a new version:

1. **Make sure all changes are committed** to your code

2. **Run the publish script**:
   ```bash
   cd GeoCoins/docker
   publish.bat
   ```

3. **Wait for completion** (takes 2-5 minutes depending on changes)

4. **Verify images are published**:
   - Go to: https://github.com/kamenj?tab=packages
   - You should see `geocoins-backend` and `geocoins-frontend`

---

## Making Images Public (First Time)

After first publish, make your images publicly accessible:

1. Go to: https://github.com/users/kamenj/packages/container/geocoins-backend/settings
2. Scroll to "Danger Zone"
3. Click "Change visibility" → "Public"
4. Confirm

Repeat for `geocoins-frontend`

---

## Distributing to Users

### Option 1: ZIP File

Create a ZIP containing the `deploy` folder:
```
GeoCoins-Deploy.zip
├── docker-compose.yml
├── .env.example
├── install.bat
├── start.bat
├── stop.bat
├── update.bat
├── logs.bat
└── README.md
```

Users extract and run `install.bat`

### Option 2: GitHub Release

1. Create a release on your GitHub repo
2. Attach the deployment ZIP
3. Users download from: https://github.com/kamenj/GeoCoins/releases

---

## Version Management

### Tagging Specific Versions

Instead of just `latest`, you can tag versions:

```bash
docker tag docker-backend ghcr.io/kamenj/geocoins-backend:v1.0.0
docker tag docker-backend ghcr.io/kamenj/geocoins-backend:latest

docker push ghcr.io/kamenj/geocoins-backend:v1.0.0
docker push ghcr.io/kamenj/geocoins-backend:latest
```

Then users can specify version in `docker-compose.yml`:
```yaml
backend:
  image: ghcr.io/kamenj/geocoins-backend:v1.0.0
```

---

## Troubleshooting

### "unauthorized: unauthenticated"
- You're not logged in. Run: `docker login ghcr.io -u kamenj`

### "denied: permission_denied"
- Token doesn't have correct permissions
- Create new token with `write:packages` scope

### Images show as private
- Go to package settings and change visibility to Public

### Users can't pull images
- Make sure packages are set to Public visibility
- Check package exists at: https://github.com/kamenj?tab=packages
