import fs from 'fs'
import path from 'path'
import axios from 'axios'

class PersistentCache {
  constructor(cacheDir) {
    if (process.env.PERSISTENT_ENABLED) {
      path.resolve(__dirname, process.env.PERSISTENT_DIR || '.mfe-cache')
      this.cacheDir = cacheDir
      // Ensure cache directory exists
      if (!fs.existsSync(this.cacheDir)) {
        fs.mkdirSync(this.cacheDir)
      }
      console.debug('PersistentCache: ' + this.cacheDir)
    }
  }
  async fetchUrl(url, filename) {
    const cachePath = path.join(cacheDir, filename)

    // Check if module is cached
    if (process.env.PERSISTENT_ENABLED && fs.existsSync(cachePath)) {
      return fs.readFileSync(cachePath, 'utf8')
    }
    const response = await axios.get(url)
    if (process.env.PERSISTENT_ENABLED) {
      fs.writeFileSync(cachePath, response.data)
    }
    return response.data
  }
}

export default PersistentCache
