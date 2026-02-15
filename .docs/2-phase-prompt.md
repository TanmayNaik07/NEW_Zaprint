1.SO now you have broken the order page you should fix that as soon as possible. anyhow these were the errors:
Error fetching orders: {
  message: 'TypeError: fetch failed',
  details: 'TypeError: fetch failed\n' +
    '\n' +
    'Caused by: HeadersTimeoutError: Headers Timeout Error (UND_ERR_HEADERS_TIMEOUT)\n' +
    'HeadersTimeoutError: Headers Timeout Error\n' +
    '    at FastTimer.onParserTimeout [as _onTimeout] (node:internal/deps/undici/undici:7505:32)\n' +
    '    at Timeout.onTick [as _onTimeout] (node:internal/deps/undici/undici:689:17)\n' +
    '    at listOnTimeout (node:internal/timers:605:17)\n' +
    '    at process.processTimers (node:internal/timers:541:7)',
  hint: '',
  code: ''
}
Error fetching orders: {
  message: 'TypeError: fetch failed',
  details: 'TypeError: fetch failed\n' +
    '\n' +
    'Caused by: HeadersTimeoutError: Headers Timeout Error (UND_ERR_HEADERS_TIMEOUT)\n' +
    'HeadersTimeoutError: Headers Timeout Error\n' +
    '    at FastTimer.onParserTimeout [as _onTimeout] (node:internal/deps/undici/undici:7505:32)\n' +
    '    at Timeout.onTick [as _onTimeout] (node:internal/deps/undici/undici:689:17)\n' +
    '    at listOnTimeout (node:internal/timers:605:17)\n' +
    '    at process.processTimers (node:internal/timers:541:7)',
  hint: '',
  code: ''
}
And also the maximum call stack size exceeded error is also there. fix that as soon as possible

2. Also make the 