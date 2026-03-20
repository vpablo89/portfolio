import { fallbackProjects } from "@/data/projectsFallback"
import type { PortfolioProject } from "@/types/project"

interface GitHubRepo {
  name: string
  html_url: string
  description: string | null
  fork: boolean
  language: string | null
  topics?: string[]
  pushed_at: string
  homepage?: string | null
}

const DEFAULT_USERNAME = "vpablo89"
const MAX_PROJECTS = 6
const preferredRepoUrls = [
  "https://github.com/vpablo89/padel-manager",
  "https://github.com/vpablo89/bookingsystem",
  "https://github.com/vpablo89/tournament-manager",
]

const topicToStack: Record<string, string> = {
  typescript: "TypeScript",
  javascript: "JavaScript",
  node: "Node.js",
  nodejs: "Node.js",
  express: "Express",
  java: "Java",
  spring: "Spring Boot",
  springboot: "Spring Boot",
  postgres: "PostgreSQL",
  postgresql: "PostgreSQL",
  mysql: "MySQL",
  react: "React",
  nextjs: "Next.js",
  jest: "Jest",
  supertest: "Supertest",
}

const formatRepoName = (name: string) =>
  name
    .split(/[-_]/g)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ")

const inferStack = (repo: GitHubRepo): string[] => {
  const stack = new Set<string>()

  if (repo.language) stack.add(repo.language)
  for (const topic of repo.topics ?? []) {
    const mapped = topicToStack[topic.toLowerCase()]
    if (mapped) stack.add(mapped)
  }
  return Array.from(stack).slice(0, 5)
}

const makeFeatures = (repo: GitHubRepo): string[] => {
  const features: string[] = ["API REST"]

  if ((repo.topics ?? []).some((topic) => ["auth", "jwt", "authentication"].includes(topic.toLowerCase()))) {
    features.push("Autenticacion y autorizacion")
  }
  if ((repo.topics ?? []).some((topic) => ["testing", "jest", "supertest", "junit"].includes(topic.toLowerCase()))) {
    features.push("Testing automatizado")
  }
  if ((repo.topics ?? []).some((topic) => ["postgres", "postgresql", "mysql", "database"].includes(topic.toLowerCase()))) {
    features.push("Persistencia con base de datos")
  }
  if (features.length < 3) {
    features.push("Validacion de datos")
  }

  return features.slice(0, 4)
}

const mapRepoToProject = (repo: GitHubRepo): PortfolioProject => {
  const description =
    repo.description?.trim() ||
    "Proyecto de software orientado a resolver un problema real."

  return {
    name: formatRepoName(repo.name),
    description,
    problem: `Resuelve ${description.charAt(0).toLowerCase()}${description.slice(1)} en un flujo centralizado.`,
    stack: inferStack(repo),
    features: makeFeatures(repo),
    learned: "Mejoras iterativas en arquitectura, calidad de codigo y pruebas.",
    githubUrl: repo.html_url,
    demoUrl: repo.homepage || undefined,
    updatedAt: repo.pushed_at,
  }
}

export const getPortfolioProjects = async (): Promise<PortfolioProject[]> => {
  const username = import.meta.env.GITHUB_USERNAME || DEFAULT_USERNAME
  const token = import.meta.env.GITHUB_TOKEN

  const headers: HeadersInit = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  try {
    const response = await fetch(
      `https://api.github.com/users/${username}/repos?sort=updated&per_page=100`,
      { headers },
    )

    if (!response.ok) {
      throw new Error(`GitHub API error ${response.status}`)
    }

    const repos = (await response.json()) as GitHubRepo[]

    const isPreferred = (repo: GitHubRepo) => preferredRepoUrls.includes(repo.html_url)

    const relevantRepos = repos
      .filter((repo) => !repo.fork && (repo.description || isPreferred(repo)))
      .sort((a, b) => new Date(b.pushed_at).getTime() - new Date(a.pushed_at).getTime())

    // Primero tomamos los que estan "top por fecha" (para mantener variedad).
    const topProjects = relevantRepos.slice(0, MAX_PROJECTS).map(mapRepoToProject)

    const topByUrl = new Map(topProjects.map((project) => [project.githubUrl, project]))

    // Despues garantizamos que esten los 3 repos preferidos si existen en GitHub.
    const preferredProjects: PortfolioProject[] = []
    for (const url of preferredRepoUrls) {
      const existing = topByUrl.get(url)
      if (existing) {
        preferredProjects.push(existing)
        continue
      }

      const repo = relevantRepos.find((r) => r.html_url === url)
      if (repo) {
        preferredProjects.push(mapRepoToProject(repo))
      }
    }

    // Completamos hasta MAX_PROJECTS respetando el orden "top por fecha"
    // (sin duplicar los preferidos).
    const finalProjects: PortfolioProject[] = []
    const used = new Set<string>()

    for (const p of preferredProjects) {
      if (used.has(p.githubUrl)) continue
      used.add(p.githubUrl)
      finalProjects.push(p)
    }

    for (const p of topProjects) {
      if (finalProjects.length >= MAX_PROJECTS) break
      if (used.has(p.githubUrl)) continue
      used.add(p.githubUrl)
      finalProjects.push(p)
    }

    return finalProjects.length > 0 ? finalProjects : fallbackProjects
  } catch {
    return fallbackProjects
  }
}
