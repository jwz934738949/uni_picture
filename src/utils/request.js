export default (params) => {
  return new Promise((resolve, reject) => {
    // 添加加载中提示
    uni.showLoading({
      title: '加载中'
    })

    uni.request({
      ...params,
      success: (res) => {
        resolve(res.data)
      },
      fail: (err) => {
        reject(err)
      },
      complete: () => {
        uni.hideLoading()
      }
    })
  })
}