import { readFile, readdir, mkdir, open, stat } from 'fs/promises'
import { join, parse } from 'path'
import { CACHE_PATH } from './constants.js'
import hashit from './hashit.js'
import { glob } from 'fs/promises'
import { spawnSync } from 'child_process'
import Listr from 'listr'
import os from 'os'
const availableCpuCores = os.cpus().length

const orderedList = ['messages', 'addresses', 'lib']
const root = 'packages'
const start = Date.now()
const build = async (root, project) =>
  new Promise((resolve) => {
    try {
      const spawnee = spawnSync(`npm run build`, { cwd: join(process.cwd(), root, project), shell: true })
      // todo better error handling
      if (process.argv.includes('--log')) {
        const stderr = spawnee.stderr.toString()
        if (stderr.includes('ERR') || stderr.includes('error')) console.warn(stderr)
      }
      resolve()
    } catch (error) {
      console.log(error.message)
      if (error.message.includes('Missing script: "build"')) {
        console.warn(`no npm run build command present for ${project}`)
      }
    }
  })

const transformWorkspaceDir = async (root) =>
  await Promise.all(
    (
      await readdir(root)
