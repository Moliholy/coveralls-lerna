#!/usr/bin/env node

'use strict'

const path = require('path')
const fs = require('fs-extra')
const coveralls = require('../')
const yargs = require('yargs')

const argv = yargs
  .option('coverage-dir', {
    description: 'Specify where the coverage directory is inside each repository',
    default: 'coverage',
    demandOption: false,
    type: 'string'
  })
  .help()
  .alias('help', 'h').argv

async function main () {
  const files = await fs.readdir(path.join(process.cwd(), 'packages'))

  const reports = files
    .filter(dir => fs.existsSync(path.join('packages', dir, argv.coverageDir, 'lcov.info')))
    .map(dir => {
      return {
        type: 'lcov',
        reportFile: path.join('packages', dir, argv.coverageDir, 'lcov.info'),
        workingDirectory: path.join('packages', dir)
      }
    })

  const url = await coveralls.sendReports(reports)

  console.log('POST to Coveralls successful!')
  console.log('Job URL:', url)
}

main()
  .catch(err => {
    console.error(err)
    process.exit(1)
  })
