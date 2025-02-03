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
## Kubernetes Deploymennt

### Deploy
```bash
$> make k8s_deploy
```
Wait 10-20 seconds and you can browse the api at <http://localhost/docs>
To analyze the state of the pods:
```bash
$> kubectl get pods
```
You should see something like this: 
```
contacts-api-deployment-6cfb6876fd-c65vw    1/1     Running   0          29s
ingress-nginx-deployment-59bd5b47c6-x47lk   1/1     Running   0          29s
mongodb-deployment-6dbc95f99c-sv55n         1/1     Running   0          29s
```
In case there is any problem, take a look at the logs of the pod: 
```bash
$> kubectl logs ingress-nginx-deployment-59bd5b47c6-x47lk
```
If ingress shows a permission problem, you should set up a permisive policy with the following command:
```bash
$> kubectl create clusterrolebinding permissive-binding \
  --clusterrole=cluster-admin \
  --user=admin \
  --user=kubelet \
  --group=system:serviceaccounts
```

### Clean up
$> make k8s_clean
```