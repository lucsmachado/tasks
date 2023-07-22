import fs from 'node:fs'
import { parse } from 'csv-parse'

export class csvParser {
  #parser = null
  #records = []

  constructor(path) {
    this.#parser = fs.createReadStream(path, 'utf8')
      .pipe(parse({
        columns: true
      }))
  }

  async upload() {
    for await (const record of this.#parser) {
      this.#records.push(record)

      await fetch('http://localhost:3333/tasks', {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(record)
      })
    }
    return this.#records
  }
}

const filePath = new URL('../../tasks.csv', import.meta.url)
const parser = new csvParser(filePath)
await parser.upload();
