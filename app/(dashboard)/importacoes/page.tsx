"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Upload, FileSpreadsheet, Type, CheckCircle, XCircle, Clock } from "lucide-react"
import { parseExcel, parseCSV, parseTextCSV, detectDelimiter, type ParsedData } from "@/lib/import-utils"

type Empresa = {
  id: string
  nomeEmpresa: string
}

type Importacao = {
  id: string
  nomeOrigem: string
  status: string
  linhasImportadas: number
  criadoEm: string
  empresa: { nomeEmpresa: string }
}

const CAMPOS_MAPEAMENTO = [
  { value: "canal", label: "Canal *", obrigatorio: true },
  { value: "ferramenta", label: "Ferramenta *", obrigatorio: true },
  { value: "data", label: "Data *", obrigatorio: true },
  { value: "periodo", label: "Período" },
  { value: "campanha", label: "Campanha" },
  { value: "grupoAnuncio", label: "Grupo de Anúncio" },
  { value: "anuncio", label: "Anúncio" },
  { value: "objetivo", label: "Objetivo" },
  { value: "impressoes", label: "Impressões" },
  { value: "alcance", label: "Alcance" },
  { value: "cliques", label: "Cliques" },
  { value: "ctr", label: "CTR (%)" },
  { value: "cpc", label: "CPC" },
  { value: "cpm", label: "CPM" },
  { value: "investimento", label: "Investimento" },
  { value: "conversoes", label: "Conversões" },
  { value: "custoPorConversao", label: "Custo por Conversão" },
  { value: "receita", label: "Receita" },
  { value: "roas", label: "ROAS" },
  { value: "leads", label: "Leads" },
  { value: "sessoes", label: "Sessões" },
  { value: "usuarios", label: "Usuários" },
  { value: "vendas", label: "Vendas" },
]

export default function ImportacoesPage() {
  const [empresas, setEmpresas] = useState<Empresa[]>([])
  const [importacoes, setImportacoes] = useState<Importacao[]>([])
  const [empresaSelecionada, setEmpresaSelecionada] = useState("")
  const [parsedData, setParsedData] = useState<ParsedData | null>(null)
  const [mapeamento, setMapeamento] = useState<Record<string, string>>({})
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState("")
  const [step, setStep] = useState<"upload" | "mapping" | "done">("upload")

  useEffect(() => {
    fetchEmpresas()
    fetchImportacoes()
  }, [])

  async function fetchEmpresas() {
    const res = await fetch("/api/empresas")
    if (res.ok) {
      const data = await res.json()
      setEmpresas(data)
      if (data.length > 0) setEmpresaSelecionada(data[0].id)
    }
  }

  async function fetchImportacoes() {
    const res = await fetch("/api/importacoes")
    if (res.ok) setImportacoes(await res.json())
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setError("")
    setIsProcessing(true)

    try {
      let data: ParsedData
      if (file.name.endsWith(".csv")) {
        data = await parseCSV(file)
      } else {
        data = await parseExcel(file)
      }

      setParsedData(data)
      setStep("mapping")
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsProcessing(false)
    }
  }

  async function handleTextPaste(text: string) {
    if (!text.trim()) return

    setError("")
    setIsProcessing(true)

    try {
      const delimiter = detectDelimiter(text)
      const data = parseTextCSV(text, delimiter)
      setParsedData(data)
      setStep("mapping")
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsProcessing(false)
    }
  }

  async function handleGoogleSheets(url: string) {
    setError("Funcionalidade em desenvolvimento. Por favor, exporte seus dados do Google Sheets e use a opção 'Upload de Arquivo'.")
  }

  async function processarImportacao() {
    if (!parsedData || !empresaSelecionada) return

    // Validar mapeamento obrigatório
    const camposObrigatorios = CAMPOS_MAPEAMENTO.filter(c => c.obrigatorio).map(c => c.value)
    const camposMapeados = Object.values(mapeamento)
    const faltando = camposObrigatorios.filter(c => !camposMapeados.includes(c))

    if (faltando.length > 0) {
      setError(`Campos obrigatórios não mapeados: ${faltando.join(", ")}`)
      return
    }

    setIsProcessing(true)
    setError("")

    try {
      // 1. Criar registro de importação
      const resImport = await fetch("/api/importacoes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          empresaId: empresaSelecionada,
          tipoOrigem: "excel_csv",
          nomeOrigem: "Importação Manual",
        }),
      })

      if (!resImport.ok) throw new Error("Erro ao criar importação")

      const importacao = await resImport.json()

      // 2. Processar dados
      const resProcessar = await fetch("/api/importacoes/processar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          importacaoId: importacao.id,
          mapeamento,
          dados: parsedData.rows,
        }),
      })

      if (!resProcessar.ok) throw new Error("Erro ao processar dados")

      const resultado = await resProcessar.json()

      if (resultado.success) {
        setStep("done")
        fetchImportacoes()
      } else {
        setError(resultado.erros?.join("; ") || "Erro ao processar")
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsProcessing(false)
    }
  }

  function resetImport() {
    setParsedData(null)
    setMapeamento({})
    setStep("upload")
    setError("")
  }

  const StatusIcon = ({ status }: { status: string }) => {
    if (status === "sucesso") return <CheckCircle className="w-4 h-4 text-green-500" />
    if (status === "erro") return <XCircle className="w-4 h-4 text-red-500" />
    return <Clock className="w-4 h-4 text-yellow-500" />
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Importações</h1>
        <p className="text-muted-foreground">Importe dados de diferentes fontes</p>
      </div>

      {step === "upload" && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Selecione a Empresa</CardTitle>
            </CardHeader>
            <CardContent>
              {empresas.length === 0 ? (
                <p className="text-sm text-muted-foreground">Você precisa cadastrar uma empresa primeiro.</p>
              ) : (
                <Select value={empresaSelecionada} onChange={(e) => setEmpresaSelecionada(e.target.value)}>
                  {empresas.map(emp => (
                    <option key={emp.id} value={emp.id}>{emp.nomeEmpresa}</option>
                  ))}
                </Select>
              )}
            </CardContent>
          </Card>

          <Tabs value="arquivo" onValueChange={() => {}}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="arquivo">
                <FileSpreadsheet className="w-4 h-4 mr-2" />
                Upload de Arquivo
              </TabsTrigger>
              <TabsTrigger value="texto">
                <Type className="w-4 h-4 mr-2" />
                Texto Colado
              </TabsTrigger>
              <TabsTrigger value="sheets">
                <Upload className="w-4 h-4 mr-2" />
                Google Sheets
              </TabsTrigger>
            </TabsList>

            <TabsContent value="arquivo">
              <Card>
                <CardHeader>
                  <CardTitle>Upload de Arquivo Excel ou CSV</CardTitle>
                  <CardDescription>Formatos aceitos: .xlsx, .xls, .csv</CardDescription>
                </CardHeader>
                <CardContent>
                  {error && <div className="mb-4 p-3 bg-destructive/15 text-destructive text-sm rounded">{error}</div>}
                  <Input type="file" accept=".xlsx,.xls,.csv" onChange={handleFileUpload} disabled={isProcessing || !empresaSelecionada} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="texto">
              <Card>
                <CardHeader>
                  <CardTitle>Cole seus dados (formato CSV)</CardTitle>
                  <CardDescription>Cole dados do Excel ou CSV. Delimitadores: , ; ou tab</CardDescription>
                </CardHeader>
                <CardContent>
                  {error && <div className="mb-4 p-3 bg-destructive/15 text-destructive text-sm rounded">{error}</div>}
                  <Textarea
                    placeholder="Cole seus dados aqui..."
                    rows={10}
                    disabled={isProcessing || !empresaSelecionada}
                    onBlur={(e) => handleTextPaste(e.target.value)}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="sheets">
              <Card>
                <CardHeader>
                  <CardTitle>Google Sheets</CardTitle>
                  <CardDescription>Cole o link da planilha pública</CardDescription>
                </CardHeader>
                <CardContent>
                  {error && <div className="mb-4 p-3 bg-destructive/15 text-destructive text-sm rounded">{error}</div>}
                  <div className="space-y-4">
                    <Input
                      placeholder="https://docs.google.com/spreadsheets/d/..."
                      disabled={isProcessing || !empresaSelecionada}
                      onBlur={(e) => handleGoogleSheets(e.target.value)}
                    />
                    <p className="text-sm text-muted-foreground">
                      Certifique-se de que a planilha está configurada como "Qualquer pessoa com o link pode visualizar"
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}

      {step === "mapping" && parsedData && (
        <Card>
          <CardHeader>
            <CardTitle>Mapeamento de Colunas</CardTitle>
            <CardDescription>{parsedData.rows.length} linhas encontradas. Mapeie as colunas para os campos do sistema.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && <div className="p-3 bg-destructive/15 text-destructive text-sm rounded">{error}</div>}

            <div className="grid gap-4 md:grid-cols-2">
              {parsedData.headers.map((header) => (
                <div key={header} className="space-y-2">
                  <Label>{header}</Label>
                  <Select
                    value={mapeamento[header] || ""}
                    onChange={(e) => setMapeamento({ ...mapeamento, [header]: e.target.value })}
                  >
                    <option value="">Não importar</option>
                    {CAMPOS_MAPEAMENTO.map((campo) => (
                      <option key={campo.value} value={campo.value}>{campo.label}</option>
                    ))}
                  </Select>
                </div>
              ))}
            </div>

            <div className="border rounded-lg p-4 max-h-60 overflow-auto">
              <p className="text-sm font-medium mb-2">Pré-visualização (5 primeiras linhas):</p>
              <Table>
                <TableHeader>
                  <TableRow>
                    {parsedData.headers.slice(0, 5).map(h => <TableHead key={h}>{h}</TableHead>)}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {parsedData.rows.slice(0, 5).map((row, i) => (
                    <TableRow key={i}>
                      {parsedData.headers.slice(0, 5).map(h => <TableCell key={h}>{row[h]}</TableCell>)}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={resetImport}>Cancelar</Button>
              <Button onClick={processarImportacao} disabled={isProcessing}>
                {isProcessing ? "Processando..." : "Importar Dados"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === "done" && (
        <Card>
          <CardHeader>
            <CardTitle>Importação Concluída!</CardTitle>
            <CardDescription>Seus dados foram importados com sucesso.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={resetImport}>Nova Importação</Button>
          </CardContent>
        </Card>
      )}

      {/* Histórico */}
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Importações</CardTitle>
        </CardHeader>
        <CardContent>
          {importacoes.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nenhuma importação realizada ainda</p>
          ) : (
            <div className="space-y-2">
              {importacoes.map((imp) => (
                <div key={imp.id} className="flex items-center justify-between p-3 border rounded">
                  <div className="flex items-center gap-3">
                    <StatusIcon status={imp.status} />
                    <div>
                      <p className="font-medium">{imp.nomeOrigem}</p>
                      <p className="text-sm text-muted-foreground">{imp.empresa.nomeEmpresa} • {imp.linhasImportadas} linhas</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{new Date(imp.criadoEm).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
