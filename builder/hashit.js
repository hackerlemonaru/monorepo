import { createReadStream, createWriteStream } from 'node:fs'
import { open, mkdir, writeFile, readFile } from 'fs/promises'
import { createHash } from 'node:crypto'
import { Writable, Readable } from 'node:stream'
import fs from 'node:fs'
import { join } from 'path'
import { CACHE_PATH } from './constants.js'

class CacheStream extends Writable {
  constructor(resolver) {
    super()
    this.resolver = resolver
  }
  _write(chunk, encoding, callback) {
    this.resolver(chunk)

    // fs.write(this.fd, chunk, callback)
  }
}

class CompareStream extends Writable {
  constructor({ resolver, path, project }) {
    super()
    this.resolver = resolver
    this.path = path
    this.project = project
  }
  async _construct(callback) {
    try {
      this.fd = await open(this.path)
    } catch (error) {}
    callback()
  }
  async _write(chunk, encoding, callback) {
    let changed = true
    const chunkString = chunk.toString('hex')
    if (this.fd) {
      await this.fd.close()
      const hash = await readFile(this.path)
      console.log(hash.toString() === chunkString)
      if (hash.toString() === chunkString) {
        changed = false
      }
    }

    if (changed) await writeFile(this.path, chunk)
    this.resolver({ hash: chunkString, project: this.project, changed })
    // fs.write(this.fd, chunk, callback)
  }
}

const readAndCache = (file) =>
  new Promise((resolve) => {
    const hash = createHash('SHA1')
    try {
      const input = createReadStream(file)
      input.pipe(hash).setEncoding('hex').pipe(new CacheStream(resolve))
    } catch (error) {
      console.error(error)
    }
  })

