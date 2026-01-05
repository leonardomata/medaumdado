"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { FileText, Download, Calendar } from "lucide-react"

export default function RelatoriosPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Relatórios</h1>
        <p className="text-muted-foreground">
          Gere relatórios personalizados dos seus dados
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4">
              <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <CardTitle>Relatório Mensal</CardTitle>
            <CardDescription>
              Resumo completo das métricas do mês
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full">
              <Download className="w-4 h-4 mr-2" />
              Gerar Relatório
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mb-4">
              <Calendar className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <CardTitle>Relatório por Período</CardTitle>
            <CardDescription>
              Escolha datas específicas para análise
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Personalizar
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mb-4">
              <FileText className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <CardTitle>Relatório por Canal</CardTitle>
            <CardDescription>
              Performance detalhada por canal
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Gerar
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Relatório Personalizado</CardTitle>
          <CardDescription>
            Configure seu próprio relatório com métricas específicas
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Empresa</Label>
              <Select>
                <option value="">Selecione a empresa</option>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Formato</Label>
              <Select>
                <option value="pdf">PDF</option>
                <option value="xlsx">Excel (XLSX)</option>
                <option value="csv">CSV</option>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Métricas Incluídas</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {["Investimento", "Leads", "Receita", "ROAS", "CTR", "CPC"].map((metrica) => (
                <label key={metrica} className="flex items-center space-x-2 cursor-pointer">
                  <input type="checkbox" className="rounded" defaultChecked />
                  <span className="text-sm">{metrica}</span>
                </label>
              ))}
            </div>
          </div>

          <Button>
            <Download className="w-4 h-4 mr-2" />
            Gerar Relatório Personalizado
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Relatórios Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-8">
            Nenhum relatório gerado ainda
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
