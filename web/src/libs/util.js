import Cookies from 'js-cookie'

export const TOKEN_KEY = 'token'

const objEqual = (obj1, obj2) => {
  const keysArr1 = Object.keys(obj1)
  const keysArr2 = Object.keys(obj2)
  if (keysArr1.length !== keysArr2.length) return false
  else if (keysArr1.length === 0 && keysArr2.length === 0) return true
  /* eslint-disable-next-line */
  else return !keysArr1.some(key => obj1[key] != obj2[key])
}

export const setToken = (data) => {
  if (data) {
    const { token, expiresIn } = data
    Cookies.set(TOKEN_KEY, token, { expires: expiresIn / (24 * 60 * 60) })
  } else {
    Cookies.remove(TOKEN_KEY)
  }
}

export const getToken = () => {
  const token = Cookies.get(TOKEN_KEY)
  return token ? token : null
}