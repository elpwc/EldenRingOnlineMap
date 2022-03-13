// can't mix import/export with require in one file
// https://github.com/rollup/rollup/issues/1058#issuecomment-254187433
// 开发时 mock api 进行测试
if (process.env.NODE_ENV === 'development') {
  const { worker } = require('./mocks/browser')
  worker.start()
}
