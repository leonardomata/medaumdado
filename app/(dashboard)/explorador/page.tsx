"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"

type DadoMarketing = {
  id: string
  data: string
  canal: string
  ferramenta: string
  campanha: string | null
  investimento: number | null
  leads: number | null
  receita: number | null
  impressoes: number | null
  cliques: number | null
}

export default function ExploradorPage() {
  const [dados, setDados] = useState<DadoMarketing[]>([])
  const [empresaId, setEmpresaId] = useState("")
  const [empresas, setEmpresas] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    fetchEmpresas()
  }, [])

  async function fetchEmpresas() {
    const res = await fetch("/api/empresas")
    if (res.ok) {
      const data = await res.json()
      setEmpresas(data)
      if (data.length > 0) setEmpresaId(data[0].id)
    }
  }

  async function buscarDados() {
    if (!empresaId) return

    setIsLoading(true)
    try {
      const res = await fetch(`/api/dashboard?empresaId=${empresaId}`)
      if (res.ok) {
        // Aqui em um cenário real, teríamos uma API específica para listar os dados brutos
        // Por simplicidade, vamos mostrar uma mensagem
        setDados([])
      }
    } catch (error) {
      console.error("Erro:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Explorador de Dados</h1>
        <p className="text-muted-foreground">
          Visualize e explore todos os dados importados
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="space-y-2">
              <Label>Empresa</Label>
              <Select value={empresaId} onChange={(e) => setEmpresaId(e.target.value)}>
                <option value="">Selecione...</option>
                {empresas.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.nomeEmpresa}
                  </option>
                ))}
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Data Início</Label>
              <Input type="date" />
            </div>

            <div className="space-y-2">
              <Label>Data Fim</Label>
              <Input type="date" />
            </div>

            <div className="space-y-2">
              <Label>&nbsp;</Label>
              <Button onClick={buscarDados} disabled={isLoading} className="w-full">
                <Search className="w-4 h-4 mr-2" />
                Buscar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Dados</CardTitle>
        </CardHeader>
        <CardContent>
          {dados.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                Selecione uma empresa e clique em "Buscar" para visualizar os dados
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Canal</TableHead>
                  <TableHead>Ferramenta</TableHead>
                  <TableHead>Campanha</TableHead>
                  <TableHead>Investimento</TableHead>
                  <TableHead>Leads</TableHead>
                  <TableHead>Receita</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dados.map((dado) => (
                  <TableRow key={dado.id}>
                    <TableCell>{new Date(dado.data).toLocaleDateString()}</TableCell>
                    <TableCell>{dado.canal}</TableCell>
                    <TableCell>{dado.ferramenta}</TableCell>
                    <TableCell>{dado.campanha || "-"}</TableCell>
                    <TableCell>
                      {dado.investimento ? `R$ ${dado.investimento.toFixed(2)}` : "-"}
                    </TableCell>
                    <TableCell>{dado.leads || "-"}</TableCell>
                    <TableCell>
                      {dado.receita ? `R$ ${dado.receita.toFixed(2)}` : "-"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
