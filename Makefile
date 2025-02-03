# Docker registry
REGISTRY ?= index.docker.io
#Image namespace
NAMESPACE ?= pafmon
# image name
APPNAME ?= do-contacts-api
#image default tag
IMAGETAG ?= latest

IMAGENAME = ${REGISTRY}/${NAMESPACE}/${APPNAME}:${IMAGETAG}

build:
	docker build -t ${IMAGENAME} api-server

push:
	docker push ${IMAGENAME}

clean_iamge:
	docker rmi ${IMAGENAME}

compose_deploy:
	docker-compose -f api-server/docker-compose.yml up -d

compose_clean:
	docker-compose -f api-server/docker-compose.yml down
