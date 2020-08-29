# create-webapp

- 开发环境: MacOS
- 此模版使用情况: 适用于快速项目, 非大规模集群，不考虑docker和k8s

## Version

采用最外层package.json中的Version。

## Package

通过gulp借docker将程序打包为deb, 如果部署的目标系统是CentOS, 则可改为rpm。

依赖包: nginx, redis, mongodb

参考:
- [Web程序打包和安装方式 (非docker方式)](https://github.com/nonocast/me/issues/77)
- [dpkg 及其仓库搭建 · Issue #78](https://github.com/nonocast/me/issues/78)

## service

### Package 

通过webpack打包。

### Logging

通过winston输出到文件，通过filebeat采集到ELK分析。

### Documentation

- API: swagger。
- 普通文档: docsify

### Runtime

通过pm2 cluster运行。

## webapp

