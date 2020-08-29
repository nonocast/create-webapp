/**
 * Prerequisite:
 * - docker
 * 
 * Usage:
 * 
 * gulp: means gulp package deb package file
 * gulp --series package push: means package and then push
 * gulp --series package deploy
 * gulp --series package push deploy
 * 
 */
const fs = require('fs-extra')
const debug = require('debug')('app');
const { src, dest, series } = require('gulp');
const shelljs = require('shelljs');
const zip = require('gulp-zip');
const mustache = require('gulp-mustache');
const pkg = require('./package.json');

let outputFileName = `${pkg.name}_${pkg.version}.deb`;

async function clean() {
  shelljs.exec('npx rimraf dist');
}

async function init() {
  await new Promise((resolve, reject) => {
    src('./setup/DEBIAN/**').pipe(mustache(pkg)).pipe(dest('./dist/image/DEBIAN')).on('end', resolve);
  });

  await new Promise((resolve, reject) => {
    src('./setup/gateway/**').pipe(dest('./dist/image/etc/nginx/sites-enabled')).on('end', resolve);
  });
}

async function build() {
  // service 
  shelljs.exec('yarn --cwd ./service > /dev/null');
  shelljs.exec('yarn --cwd ./service build > /dev/null');
  await new Promise((resolve, reject) => {
    src(`./service/dist/**`).pipe(dest('./dist/image/app/create-webapp/service')).on('end', resolve);
  });

  // sync service version
  let servicePackagePath = './dist/image/app/create-webapp/service/package.json';
  let servicePackage = require(servicePackagePath);
  servicePackage.version = pkg.version;
  await fs.writeJson(servicePackagePath, servicePackage, { spaces: 2 });

  // webapp
  shelljs.exec('yarn --cwd ./webapp > /dev/null');
  shelljs.exec('yarn --cwd ./webapp build > /dev/null');
  await new Promise((resolve, reject) => {
    src(`./webapp/build/**`).pipe(dest('./dist/image/app/create-webapp/webapp')).on('end', resolve);
  });
}

// thin-package (without node_module)
async function package() {
  if (process.platform === 'darwin') {
    shelljs.exec(`docker run --rm -v $(pwd)/dist:/app ubuntu dpkg -b /app/image /app/${outputFileName} > /dev/null`);
  } else {
    shelljs.exec(`dpkg -b ./dist/image ./dist/${outputFileName}`);
  }
}

// fat-package (with node_module)
async function fat() {
  if (process.platform === 'darwin') {
    let cmd = `cd /app/image/app/hello365/service && yarn install --production && dpkg -b /app/image /app/${outputFileName.replace('.deb', '-fat.deb')} > /dev/null`;
    shelljs.exec(`docker run --rm -v $(pwd)/dist:/app node:latest bash -c '${cmd}'`);
  }
}

exports.deploy = async () => {
  let server = 'shgbit@unispaceservice.com'
  shelljs.exec(`scp ./dist/${outputFileName} ${server}:/tmp`);
  shelljs.exec(`ssh ${server} sudo dpkg -i /tmp/${outputFileName}`);
}

exports.push = async () => {
  let server = 'shgbit@unispaceservice.com'
  shelljs.exec(`scp ./dist/${outputFileName} ${server}:/var/www/repo`);
  shelljs.exec(`ssh ${server} 'cd /var/www/repo && dpkg-scanpackages -m . > Packages'`);
}

exports.fat = fat;
exports.clean = clean;
exports.build = series(clean, init, build);
exports.package = series(clean, init, build, package);
exports.default = exports.package;
