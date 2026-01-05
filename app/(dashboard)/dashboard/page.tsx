"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MetricCard } from "@/components/dashboard/metric-card"
import { ChartWrapper } from "@/components/dashboard/chart-wrapper"
import { TrendingUp, DollarSign, Users, Target, Filter } from "lucide-react"

type Empresa = {
  id: string
  nomeEmpresa: string
}

type DashboardData = {
  totais: {
    investimento: number
    leads: number
    receita: number
    roas: number
    impressoes: number
    cliques: number
    conversoes: number
    vendas: number
  }
  evolucao: any[]
  porCanal: any[]
  porFerramenta: any[]
  funil: {
    impressoes: number
    cliques: number
    leads: number
    vendas: number
    taxaClique: number
    taxaConversaoLead: number
    taxaConversaoVenda: number
  }
}

export default function DashboardPage() {
  const [empresas, setEmpresas] = useState<Empresa[]>([])
  const [filtros, setFiltros] = useState({
    empresaId: "",
    dataInicio: "",
    dataFim: "",
    canal: "",
    ferramenta: "",
  })
  const [data, setData] = useState<DashboardData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchEmpresas()
  }, [])

  useEffect(() => {
    fetchDashboardData()
  }, [filtros])

  async function fetchEmpresas() {
    const res = await fetch("/api/empresas")
    if (res.ok) {
      const empresas = await res.json()
      setEmpresas(empresas)
    }
  }

  async function fetchDashboardData() {
    setIsLoading(true)
    try {
      const params = new URLSearchParams()
      if (filtros.empresaId) params.append("empresaId", filtros.empresaId)
      if (filtros.dataInicio) params.append("dataInicio", filtros.dataInicio)
      if (filtros.dataFim) params.append("dataFim", filtros.dataFim)
      if (filtros.canal) params.append("canal", filtros.canal)
      if (filtros.ferramenta) params.append("ferramenta", filtros.ferramenta)

      const res = await fetch(`/api/dashboard?${params}`)
      if (res.ok) {
        setData(await res.json())
      }
    } catch (error) {
      console.error("Erro ao buscar dados:", error)
    } finally {
      setIsLoading(false)
    }
  }

  function formatCurrency(value: number) {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  function formatNumber(value: number) {
    return new Intl.NumberFormat("pt-BR").format(value)
  }

  if (isLoading && !data) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    )
  }

  const temDados = data && data.totais.investimento > 0

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Visão geral dos seus dados de marketing</p>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            <div className="space-y-2">
              <Label>Empresa</Label>
              <Select
                value={filtros.empresaId}
                onChange={(e) => setFiltros({ ...filtros, empresaId: e.target.value })}
              >
                <option value="">Todas</option>
                {empresas.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.nomeEmpresa}
                  </option>
                ))}
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Data Início</Label>
              <Input
                type="date"
                value={filtros.dataInicio}
                onChange={(e) => setFiltros({ ...filtros, dataInicio: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Data Fim</Label>
              <Input
                type="date"
                value={filtros.dataFim}
                onChange={(e) => setFiltros({ ...filtros, dataFim: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Canal</Label>
              <Select
                value={filtros.canal}
                onChange={(e) => setFiltros({ ...filtros, canal: e.target.value })}
              >
                <option value="">Todos</option>
                <option value="ADS">ADS</option>
                <option value="Organico">Orgânico</option>
                <option value="Social">Social</option>
                <option value="CRM">CRM</option>
                <option value="Email">Email</option>
                <option value="Personalizado">Personalizado</option>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Ferramenta</Label>
              <Select
                value={filtros.ferramenta}
                onChange={(e) => setFiltros({ ...filtros, ferramenta: e.target.value })}
              >
                <option value="">Todas</option>
                <option value="GoogleAds">Google Ads</option>
                <option value="MetaAds">Meta Ads</option>
                <option value="GA4">GA4</option>
                <option value="SearchConsole">Search Console</option>
                <option value="Instagram">Instagram</option>
                <option value="LinkedIn">LinkedIn</option>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {!temDados ? (
        <Card>
          <CardHeader>
            <CardTitle>Nenhum dado encontrado</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Importe dados para visualizar seus dashboards. Vá em "Importações" para começar.
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Métricas Principais */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <MetricCard
              title="Investimento Total"
              value={formatCurrency(data.totais.investimento)}
              icon={DollarSign}
            />
            <MetricCard
              title="Total de Leads"
              value={formatNumber(data.totais.leads)}
              icon={Users}
            />
            <MetricCard
              title="Receita Total"
              value={formatCurrency(data.totais.receita)}
              icon={TrendingUp}
            />
            <MetricCard
              title="ROAS Médio"
              value={data.totais.roas.toFixed(2)}
              icon={Target}
              subtitle={data.totais.roas > 1 ? "Retorno positivo" : "Retorno negativo"}
            />
          </div>

          {/* Evolução Temporal */}
          <Card>
            <CardHeader>
              <CardTitle>Evolução Temporal</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartWrapper data={data.evolucao} type="line" dataKey="investimento" xAxisKey="data" />
            </CardContent>
          </Card>

          {/* Performance por Canal e Ferramenta */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Performance por Canal</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartWrapper data={data.porCanal} type="bar" dataKey="investimento" xAxisKey="name" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance por Ferramenta</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartWrapper data={data.porFerramenta} type="pie" dataKey="investimento" />
              </CardContent>
            </Card>
          </div>

          {/* Funil de Conversão */}
          <Card>
            <CardHeader>
              <CardTitle>Funil de Conversão</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Impressões</span>
                    <span className="font-medium">{formatNumber(data.funil.impressoes)}</span>
                  </div>
                  <div className="w-full bg-secondary h-8 rounded-lg overflow-hidden">
                    <div className="bg-blue-500 h-full" style={{ width: "100%" }} />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Cliques</span>
                    <span className="font-medium">
                      {formatNumber(data.funil.cliques)} ({data.funil.taxaClique.toFixed(2)}%)
                    </span>
                  </div>
                  <div className="w-full bg-secondary h-8 rounded-lg overflow-hidden">
                    <div
                      className="bg-green-500 h-full"
                      style={{ width: `${Math.min(data.funil.taxaClique * 10, 100)}%` }}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Leads</span>
                    <span className="font-medium">
                      {formatNumber(data.funil.leads)} ({data.funil.taxaConversaoLead.toFixed(2)}%)
                    </span>
                  </div>
                  <div className="w-full bg-secondary h-8 rounded-lg overflow-hidden">
                    <div
                      className="bg-yellow-500 h-full"
                      style={{ width: `${Math.min(data.funil.taxaConversaoLead, 100)}%` }}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Vendas</span>
                    <span className="font-medium">
                      {formatNumber(data.funil.vendas)} ({data.funil.taxaConversaoVenda.toFixed(2)}%)
                    </span>
                  </div>
                  <div className="w-full bg-secondary h-8 rounded-lg overflow-hidden">
                    <div
                      className="bg-purple-500 h-full"
                      style={{ width: `${Math.min(data.funil.taxaConversaoVenda, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
