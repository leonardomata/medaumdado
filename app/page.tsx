import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BarChart3, Database, TrendingUp, Zap } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center space-y-8">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white">
            Me Dá um Dado!
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Centralize todos os seus dados de marketing em um só lugar.
            Importações fáceis, dashboards automáticos, insights poderosos.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/registro">
              <Button size="lg" className="text-lg px-8">
                Começar Gratuitamente
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="text-lg px-8">
                Fazer Login
              </Button>
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="mt-24 grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4">
              <Database className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Importação Fácil</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Google Sheets, Excel, CSV ou texto. Múltiplas formas de importar seus dados.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mb-4">
              <BarChart3 className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Dashboards Automáticos</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Visualize seus dados instantaneamente com gráficos e métricas.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Multi-empresa</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Gerencie múltiplas empresas e clientes em uma única plataforma.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Insights Rápidos</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Decisões baseadas em dados de forma rápida e eficiente.
            </p>
          </div>
        </div>

        {/* Pricing */}
        <div className="mt-24">
          <h2 className="text-4xl font-bold text-center mb-12">Planos</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
              <h3 className="text-2xl font-bold mb-2">Starter</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">Para começar</p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  1 empresa
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Até 5 ferramentas
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Dashboards básicos
                </li>
              </ul>
            </div>

            <div className="bg-blue-600 text-white p-8 rounded-lg shadow-lg transform scale-105">
              <h3 className="text-2xl font-bold mb-2">Pro</h3>
              <p className="text-blue-100 mb-6">Mais popular</p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <span className="text-blue-200 mr-2">✓</span>
                  Até 5 empresas
                </li>
                <li className="flex items-center">
                  <span className="text-blue-200 mr-2">✓</span>
                  Ferramentas ilimitadas
                </li>
                <li className="flex items-center">
                  <span className="text-blue-200 mr-2">✓</span>
                  Dashboards completos
                </li>
              </ul>
            </div>

            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
              <h3 className="text-2xl font-bold mb-2">Agência</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">Para agências</p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Empresas ilimitadas
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  White-label
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Compartilhamento com clientes
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
