"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select"
import { Plus, Building2, Edit, Trash2 } from "lucide-react"

type Empresa = {
  id: string
  nomeEmpresa: string
  segmento: string | null
  fusoHorario: string
  criadoEm: string
}

export default function EmpresasPage() {
  const [empresas, setEmpresas] = useState<Empresa[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingEmpresa, setEditingEmpresa] = useState<Empresa | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchEmpresas()
  }, [])

  async function fetchEmpresas() {
    try {
      const response = await fetch("/api/empresas")
      if (response.ok) {
        const data = await response.json()
        setEmpresas(data)
      }
    } catch (error) {
      console.error("Erro ao buscar empresas:", error)
    } finally {
      setIsLoading(false)
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSubmitting(true)
    setError("")

    const formData = new FormData(event.currentTarget)
    const data = {
      nomeEmpresa: formData.get("nomeEmpresa") as string,
      segmento: formData.get("segmento") as string,
      fusoHorario: formData.get("fusoHorario") as string,
    }

    try {
      const url = editingEmpresa
        ? `/api/empresas/${editingEmpresa.id}`
        : "/api/empresas"
      const method = editingEmpresa ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        setError(result.error || "Erro ao salvar empresa")
      } else {
        setIsDialogOpen(false)
        setEditingEmpresa(null)
        fetchEmpresas()
      }
    } catch (error) {
      setError("Erro ao salvar empresa")
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Tem certeza que deseja excluir esta empresa? Todos os dados relacionados serão perdidos.")) {
      return
    }

    try {
      const response = await fetch(`/api/empresas/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        fetchEmpresas()
      }
    } catch (error) {
      console.error("Erro ao deletar empresa:", error)
    }
  }

  function openEditDialog(empresa: Empresa) {
    setEditingEmpresa(empresa)
    setIsDialogOpen(true)
    setError("")
  }

  function openCreateDialog() {
    setEditingEmpresa(null)
    setIsDialogOpen(true)
    setError("")
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Empresas</h1>
          <p className="text-muted-foreground">
            Gerencie suas empresas e clientes
          </p>
        </div>
        <Button onClick={openCreateDialog}>
          <Plus className="w-4 h-4 mr-2" />
          Nova Empresa
        </Button>
      </div>

      {empresas.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Nenhuma empresa cadastrada</CardTitle>
            <CardDescription>
              Comece adicionando sua primeira empresa para começar a importar dados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={openCreateDialog}>
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Empresa
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {empresas.map((empresa) => (
            <Card key={empresa.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                      <Building2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{empresa.nomeEmpresa}</CardTitle>
                      {empresa.segmento && (
                        <CardDescription>{empresa.segmento}</CardDescription>
                      )}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEditDialog(empresa)}
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Editar
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(empresa.id)}
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Excluir
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>
                {editingEmpresa ? "Editar Empresa" : "Nova Empresa"}
              </DialogTitle>
              <DialogDescription>
                {editingEmpresa
                  ? "Atualize as informações da empresa"
                  : "Adicione uma nova empresa ou cliente"}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              {error && (
                <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="nomeEmpresa">Nome da Empresa *</Label>
                <Input
                  id="nomeEmpresa"
                  name="nomeEmpresa"
                  placeholder="Ex: Minha Empresa Ltda"
                  defaultValue={editingEmpresa?.nomeEmpresa}
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="segmento">Segmento</Label>
                <Input
                  id="segmento"
                  name="segmento"
                  placeholder="Ex: E-commerce, SaaS, Consultoria"
                  defaultValue={editingEmpresa?.segmento || ""}
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fusoHorario">Fuso Horário</Label>
                <Select
                  id="fusoHorario"
                  name="fusoHorario"
                  defaultValue={editingEmpresa?.fusoHorario || "America/Sao_Paulo"}
                  disabled={isSubmitting}
                >
                  <option value="America/Sao_Paulo">Brasília (GMT-3)</option>
                  <option value="America/Manaus">Manaus (GMT-4)</option>
                  <option value="America/Rio_Branco">Rio Branco (GMT-5)</option>
                  <option value="America/Noronha">Fernando de Noronha (GMT-2)</option>
                </Select>
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting
                  ? "Salvando..."
                  : editingEmpresa
                  ? "Atualizar"
                  : "Criar Empresa"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
