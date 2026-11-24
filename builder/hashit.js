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
