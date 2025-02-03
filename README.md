## Direct nodejs deployment

1. Install dependencies

```bash
$> cd api-server
$> npm install
```

2. Run Server

```bash
$> cd api-server
$> node index.js
```

You can browse the api at <http://localhost:8080/docs>

## Compose Deploymennt
### Deploy
```bash
$> make compose_deploy
```
You can browse the api at <http://localhost:8080/docs>

### Clean up
```bash
$> make compose_clean
```
