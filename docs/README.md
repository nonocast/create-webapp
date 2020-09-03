# create-webapp

- 开发环境: MacOS
- 此模版使用情况: 适用于快速项目, 非大规模集群，不考虑docker和k8s

## Version

采用最外层package.json中的Version。

## Package

通过gulp借docker将程序打包为deb, 如果部署的目标系统是CentOS, 则可改为rpm。

依赖包: nginx, redis, mongodb

打包后通过-c,-I查看打包内容:

```sh
~ dpkg -I create-webapp_1.0.0.deb 
 new Debian package, version 2.0.
 size 178688 bytes: control archive=440 bytes.
     134 bytes,     5 lines      control              
      92 bytes,     5 lines   *  postinst             #!/bin/sh
      35 bytes,     2 lines   *  prerm                #!/bin/sh
 Package: create-webapp
 Version: 1.0.0
 Architecture: all
 Maintainer: nonocast <nonocast@gmail.com>
 Description: scaffold of the webapp
~
~ dpkg -c create-webapp_1.0.0.deb 
drwxr-xr-x root/root         0 2020-08-29 08:48 ./
drwxr-xr-x root/root         0 2020-08-29 08:48 ./app/
drwxr-xr-x root/root         0 2020-08-29 08:48 ./app/create-webapp/
drwxr-xr-x root/root         0 2020-08-29 08:48 ./app/create-webapp/service/
-rw-r--r-- root/root      2157 2020-08-29 08:48 ./app/create-webapp/service/bundle.js
drwxr-xr-x root/root         0 2020-08-29 08:48 ./app/create-webapp/service/config/
-rw-r--r-- root/root        51 2020-08-29 08:48 ./app/create-webapp/service/config/default.yaml
-rw-r--r-- root/root         0 2020-08-29 08:48 ./app/create-webapp/service/config/production.yaml
-rw-r--r-- root/root       198 2020-08-29 08:48 ./app/create-webapp/service/ecosystem.config.js
-rw-r--r-- root/root      8442 2020-08-28 07:48 ./app/create-webapp/service/main.js
-rw-r--r-- root/root       866 2020-08-29 08:48 ./app/create-webapp/service/package.json
drwxr-xr-x root/root         0 2020-08-29 08:48 ./app/create-webapp/webapp/
-rw-r--r-- root/root      1035 2020-08-29 08:48 ./app/create-webapp/webapp/asset-manifest.json
-rw-r--r-- root/root      3150 2020-08-29 08:48 ./app/create-webapp/webapp/favicon.ico
...
-rw-r--r-- root/root      7492 2020-08-29 08:48 ./app/create-webapp/webapp/static/js/main.6fb07dae.chunk.js.map
-rw-r--r-- root/root      1553 2020-08-29 08:48 ./app/create-webapp/webapp/static/js/runtime-main.00ed32f5.js
-rw-r--r-- root/root      8272 2020-08-29 08:48 ./app/create-webapp/webapp/static/js/runtime-main.00ed32f5.js.map
drwxr-xr-x root/root         0 2020-08-29 08:48 ./etc/
drwxr-xr-x root/root         0 2020-08-29 08:48 ./etc/nginx/
drwxr-xr-x root/root         0 2020-08-29 08:48 ./etc/nginx/sites-enabled/
-rw-r--r-- root/root       527 2020-08-29 08:43 ./etc/nginx/sites-enabled/create-webapp.conf
```

测试DEB:
`docker run -it -p 80:80 -v <deb file path>:/setup ubuntu bash`
```sh
~ /app/create-webapp/bin/install.sh 
~ /app/create-webapp/bin/start.sh 
```

参考:
- [Web程序打包和安装方式 (非docker方式)](https://github.com/nonocast/me/issues/77)
- [dpkg 及其仓库搭建 · Issue #78](https://github.com/nonocast/me/issues/78)

## service

### Package 

通过webpack打包。

### Logging

log可以分为几个level:

- 应用日志 (Application Log): 帮助用户了解系统使用情况
- 系统日志 (System Log): 文件, 帮助开发人员诊断
- 特定日志 (Specify Log): 比如ap访问，设备访问等专项日志，根据应用和规模采用合适的方式 (mongodb, es or file)

通过winston输出到文件，通过filebeat采集到ELK分析。
shell通过`jq . app-2020-09-04-00.log`

```sh
~ jq . app-2020-09-04-00.log 
{
  "message": "application starting... pid: 6267",
  "level": "info",
  "timestamp": "2020-09-03T16:37:45.739Z",
  "app": "create-webapp"
}
{
  "message": "web server started, please visit: http://0.0.0.0:10376 (with development mode)",
  "level": "info",
  "timestamp": "2020-09-03T16:37:45.745Z",
  "app": "create-webapp"
}
```

开发环境: 
```sh
docker run -d --name="elasticsearch" -p 9200:9200 -p 9300:9300 -e "discovery.type=single-node" docker.elastic.co/elasticsearch/elasticsearch:7.8.1
docker run -d --name="kibana" --link elasticsearch -p 5601:5601 docker.elastic.co/kibana/kibana:7.8.1
```

补充: sebp/elk虽然是套餐，但是版本号只有7.8.0, 建议还是跟进官方image更为直接。

然后在filebeat中配置如下:
```yml
filebeat.config.inputs:
  enabled: true
  path: inputs.d/*.yml

setup.template.settings:
  index.number_of_shards: 1

output.elasticsearch:
  hosts: ["host.docker.internal:9200"]

processors:
  - add_host_metadata: ~
  - add_cloud_metadata: ~
  - add_docker_metadata: ~
  - add_kubernetes_metadata: ~
```

create-webapp.yml

```yml
- type: log
  enabled: true
  paths:
    - /var/log/create-webapp/*.log

  json.keys_under_root: true
  json.overwrite_keys: true
  json.message_key: message
  json.add_error_key: true
```

### Documentation

- API: swagger。
- 普通文档: docsify

### Runtime

通过pm2 cluster运行。

### Login

## webapp

