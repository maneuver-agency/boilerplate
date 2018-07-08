export default {
  getProducts () {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve([
          {
            id: 1,
            title: 'iPhone X'
          },
          {
            id: 2,
            title: 'MacBook Pro'
          }
        ])
      }, 500)
    })
  }
}
