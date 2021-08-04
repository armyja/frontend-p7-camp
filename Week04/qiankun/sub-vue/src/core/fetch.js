import axios from 'axios'
export default function fetch (options) {
  const instance = axios.create({
    responseEncoding: 'utf8',
    timeout: 1000,
    baseURL: process.env.VUE_APP_BASE_URL
  })
  return new Promise((resolve, reject) => {
    console.log(process.env)
    instance(options)
      .then(res => {
        resolve(res.data)
        return false
      })
      .catch(error => {
        reject(error)
      })
  })
}
