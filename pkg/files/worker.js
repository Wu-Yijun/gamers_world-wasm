// worker.js
self.onmessage = function(e) {
    console.log('Worker: Message received from main script');
    const result = performWork(e.data); // 执行耗时任务
    self.postMessage(result);
};

function performWork(data) {
    // 模拟一个耗时任务
    const start = Date.now();
    while (Date.now() - start < 5000) {
        // 5 秒的耗时任务
    }
    return `Work complete with input: ${data}`;
}
