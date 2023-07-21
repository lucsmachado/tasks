import fs from 'node:fs/promises'

const databasePath = new URL('../db.json', import.meta.url)

export class Database {
  #database = {}

  constructor() {
    fs.readFile(databasePath, 'utf8')
      .then(data => this.#database = JSON.parse(data))
  }

  #persist() {
    fs.writeFile(databasePath, JSON.stringify(this.#database))
  }

  insert(table, data) {
    if (Array.isArray(this.#database[table])) {
      this.#database[table].push(data)
    } else {
      this.#database[table] = [data]
    }
    this.#persist()
  }

  select(table, search) {
    let data = this.#database[table] ?? [];

    if (search) {
      data = data.filter(row => {
        return Object.entries(search).some(([key, value]) => {
          return row[key].includes(value)
        })
      })
    }

    return data;
  }

  update(table, data, id) {
    if (Array.isArray(this.#database[table])) {
      const index = this.#database[table].findIndex(row => row.id === id)

      if (index > -1) {
        this.#database[table][index] = {
          ...this.#database[table][index],
          ...data,
        }

        this.#persist()
      } else {
        throw new Error('Id not found')
      }
    }
  }

  delete(table, id) {
    if (Array.isArray(this.#database[table])) {
      const index = this.#database[table].findIndex(row => row.id === id)

      if (index > -1) {
        this.#database[table].splice(index, 1)
        this.#persist()
      } else {
        throw new Error('Id not found')
      }
    }
  }
}
