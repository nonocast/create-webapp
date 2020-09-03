/**
 * 测试负载 
 * sleep(10000);  等待10秒。
 */
module.exports = sleep(milliSeconds) => {
  var startTime = new Date().getTime();
  while (new Date().getTime() < startTime + milliSeconds);
};