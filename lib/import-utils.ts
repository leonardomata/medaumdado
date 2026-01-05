import * as XLSX from 'xlsx'
import Papa from 'papaparse'

export type ParsedData = {
  headers: string[]
  rows: Record<string, any>[]
}

/**
 * Processa arquivo Excel/XLSX
 */
export async function parseExcel(file: File): Promise<ParsedData> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer)
        const workbook = XLSX.read(data, { type: 'array' })
        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: null })

        if (jsonData.length === 0) {
          reject(new Error('Planilha vazia'))
          return
        }

        const headers = Object.keys(jsonData[0] as object)
        resolve({
          headers,
          rows: jsonData as Record<string, any>[]
        })
      } catch (error) {
        reject(new Error('Erro ao processar arquivo Excel'))
      }
    }

    reader.onerror = () => reject(new Error('Erro ao ler arquivo'))
    reader.readAsArrayBuffer(file)
  })
}

/**
 * Processa arquivo CSV
 */
export async function parseCSV(file: File): Promise<ParsedData> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.errors.length > 0) {
          reject(new Error('Erro ao processar CSV'))
          return
        }

        if (results.data.length === 0) {
          reject(new Error('Arquivo CSV vazio'))
          return
        }

        resolve({
          headers: results.meta.fields || [],
          rows: results.data as Record<string, any>[]
        })
      },
      error: (error) => {
        reject(new Error(`Erro ao processar CSV: ${error.message}`))
      }
    })
  })
}

/**
 * Processa texto colado (formato CSV)
 */
export function parseTextCSV(text: string, delimiter: string = ','): ParsedData {
  const result = Papa.parse(text, {
    header: true,
    skipEmptyLines: true,
    delimiter: delimiter
  })

  if (result.errors.length > 0) {
    throw new Error('Erro ao processar texto')
  }

  if (result.data.length === 0) {
    throw new Error('Texto vazio ou inválido')
  }

  return {
    headers: result.meta.fields || [],
    rows: result.data as Record<string, any>[]
  }
}

/**
 * Detecta delimitador em texto CSV
 */
export function detectDelimiter(text: string): string {
  const delimiters = [',', ';', '\t', '|']
  const lines = text.split('\n').slice(0, 5) // Analisa primeiras 5 linhas

  let bestDelimiter = ','
  let maxColumns = 0

  for (const delimiter of delimiters) {
    const columns = lines[0]?.split(delimiter).length || 0
    if (columns > maxColumns) {
      maxColumns = columns
      bestDelimiter = delimiter
    }
  }

  return bestDelimiter
}

/**
 * Converte dados do Google Sheets (formato de array)
 */
export function parseGoogleSheets(data: string[][]): ParsedData {
  if (data.length < 2) {
    throw new Error('Dados insuficientes. É necessário pelo menos uma linha de cabeçalho e uma linha de dados.')
  }

  const headers = data[0].map(h => String(h).trim())
  const rows = data.slice(1).map(row => {
    const obj: Record<string, any> = {}
    headers.forEach((header, index) => {
      obj[header] = row[index] !== undefined ? row[index] : null
    })
    return obj
  })

  return { headers, rows }
}

/**
 * Valida se os dados têm estrutura válida
 */
export function validateParsedData(data: ParsedData): { valid: boolean; error?: string } {
  if (!data.headers || data.headers.length === 0) {
    return { valid: false, error: 'Nenhuma coluna encontrada' }
  }

  if (!data.rows || data.rows.length === 0) {
    return { valid: false, error: 'Nenhuma linha de dados encontrada' }
  }

  // Verificar se tem pelo menos 1 coluna não-vazia
  const hasData = data.rows.some(row =>
    Object.values(row).some(val => val !== null && val !== undefined && val !== '')
  )

  if (!hasData) {
    return { valid: false, error: 'Nenhum dado encontrado nas linhas' }
  }

  return { valid: true }
}
