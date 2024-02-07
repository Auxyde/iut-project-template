# iut-project-boilerplate



## Run the docker file
```bash
docker run --name hapi-mysql -e MYSQL_ROOT_PASSWORD=hapi -e MYSQL_DATABASE=user -p 3306:3306 -d mysql:8 --default-authentication-plugin=mysql_native_password
```