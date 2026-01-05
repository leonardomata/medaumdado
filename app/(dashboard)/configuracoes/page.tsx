import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { User, CreditCard, Bell, Shield } from "lucide-react"

export default async function ConfiguracoesPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return <div>Não autorizado</div>
  }

  const usuario = await prisma.usuario.findUnique({
    where: { id: session.user.id },
    include: {
      empresas: true,
      importacoes: true,
    },
  })

  if (!usuario) {
    return <div>Usuário não encontrado</div>
  }

  const planoInfo = {
    Starter: {
      nome: "Starter",
      limite: "1 empresa",
      cor: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    },
    Pro: {
      nome: "Pro",
      limite: "Até 5 empresas",
      cor: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
    },
    Agencia: {
      nome: "Agência",
      limite: "Empresas ilimitadas",
      cor: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    },
  }

  const plano = planoInfo[usuario.plano as keyof typeof planoInfo]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Configurações</h1>
        <p className="text-muted-foreground">
          Gerencie sua conta e preferências
        </p>
      </div>

      {/* Perfil */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Perfil
          </CardTitle>
          <CardDescription>Informações da sua conta</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Nome</p>
              <p className="text-lg">{usuario.nome}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Email</p>
              <p className="text-lg">{usuario.email}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Membro desde</p>
              <p className="text-lg">
                {new Date(usuario.criadoEm).toLocaleDateString("pt-BR")}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total de Empresas</p>
              <p className="text-lg">{usuario.empresas.length}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Plano */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Plano Atual
          </CardTitle>
          <CardDescription>Gerencie sua assinatura</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-2xl font-bold">{plano.nome}</h3>
                <Badge className={plano.cor}>{plano.nome}</Badge>
              </div>
              <p className="text-muted-foreground">{plano.limite}</p>
            </div>
          </div>

          <div className="border rounded-lg p-6 space-y-4">
            <h4 className="font-semibold">Uso Atual</h4>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Empresas</span>
                  <span>
                    {usuario.empresas.length} /{" "}
                    {usuario.plano === "Agencia" ? "∞" : usuario.plano === "Pro" ? "5" : "1"}
                  </span>
                </div>
                <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-primary h-full"
                    style={{
                      width: `${Math.min(
                        (usuario.empresas.length /
                          (usuario.plano === "Agencia" ? 100 : usuario.plano === "Pro" ? 5 : 1)) *
                          100,
                        100
                      )}%`,
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Importações Realizadas</span>
                  <span>{usuario.importacoes.length}</span>
                </div>
              </div>
            </div>
          </div>

          {usuario.plano !== "Agencia" && (
            <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <h4 className="font-semibold mb-2">Faça upgrade!</h4>
              <p className="text-sm text-muted-foreground mb-4">
                {usuario.plano === "Starter"
                  ? "Atualize para Pro e tenha até 5 empresas com dashboards completos."
                  : "Atualize para Agência e gerencie empresas ilimitadas com recursos white-label."}
              </p>
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium">
                  {usuario.plano === "Starter" ? "Upgrade para Pro" : "Upgrade para Agência"}
                </button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Notificações */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Notificações
          </CardTitle>
          <CardDescription>Configure como você quer ser notificado</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Notificações por Email</p>
              <p className="text-sm text-muted-foreground">
                Receba atualizações sobre suas importações
              </p>
            </div>
            <input type="checkbox" className="toggle" defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Relatórios Semanais</p>
              <p className="text-sm text-muted-foreground">
                Resumo semanal das suas métricas
              </p>
            </div>
            <input type="checkbox" className="toggle" />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Alertas de Performance</p>
              <p className="text-sm text-muted-foreground">
                Receba alertas quando métricas mudarem significativamente
              </p>
            </div>
            <input type="checkbox" className="toggle" />
          </div>
        </CardContent>
      </Card>

      {/* Segurança */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Segurança
          </CardTitle>
          <CardDescription>Mantenha sua conta segura</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="font-medium mb-2">Senha</p>
            <button className="text-sm text-primary hover:underline">
              Alterar senha
            </button>
          </div>

          <div>
            <p className="font-medium mb-2">Autenticação de dois fatores</p>
            <p className="text-sm text-muted-foreground mb-2">
              Adicione uma camada extra de segurança à sua conta
            </p>
            <button className="text-sm text-primary hover:underline">
              Ativar 2FA
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
