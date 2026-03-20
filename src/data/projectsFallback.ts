import type { PortfolioProject } from "@/types/project"

export const fallbackProjects: PortfolioProject[] = [
  {
    name: "Padel Manager",
    description: "API backend para gestionar torneos, jugadores y reservas de padel.",
    problem:
      "Centraliza la gestión de torneos, inscripciones, rankings y reservas para evitar procesos manuales y dispersos.",
    stack: ["Node.js", "TypeScript", "PostgreSQL", "Jest"],
    features: ["CRUD de torneos", "Inscripcion de jugadores", "Sistema de ranking", "Autenticacion JWT"],
    learned: "Arquitectura por capas y testing de integracion sobre endpoints reales.",
    githubUrl: "https://github.com/vpablo89/padel-manager",
  },
  {
    name: "Booking System",
    description: "Sistema de reservas de canchas con API documentada y validaciones.",
    problem: "Permite gestionar usuarios, canchas y reservas desde un backend consistente.",
    stack: ["Java", "Spring Boot", "PostgreSQL", "JUnit"],
    features: ["Endpoints REST", "Validacion de datos", "Persistencia con base de datos", "Arquitectura mantenible"],
    learned: "Buenas practicas en backend con Spring y tests de integracion.",
    githubUrl: "https://github.com/vpablo89/bookingsystem",
  },
  {
    name: "Tournament Manager",
    description: "Sistema fullstack para gestion de torneos y rankings con backend testeado.",
    problem: "Unifica la gestion de torneos, registros e informacion de ranking en un solo sistema.",
    stack: ["Node.js", "TypeScript", "Express", "PostgreSQL", "Jest"],
    features: ["CRUD de torneos", "Inscripcion de jugadores", "Sistema de ranking", "Autenticacion JWT"],
    learned: "Arquitectura por capas y testing con endpoints reales.",
    githubUrl: "https://github.com/vpablo89/tournament-manager",
  },
  {
    name: "Ecommerce Typescript",
    description: "API REST para ecommerce con autenticacion, productos y flujo de compra.",
    problem: "Gestiona el catalogo y la compra en una API centralizada.",
    stack: ["Node.js", "Express", "TypeScript", "PostgreSQL"],
    features: ["CRUD de productos", "Roles y permisos", "Carrito de compras", "Notificaciones por email"],
    learned: "Diseño de endpoints seguros y separacion clara de responsabilidades en backend.",
    githubUrl: "https://github.com/vpablo89/ecommerce-typescript",
  },
  {
    name: "ToDo App Backend",
    description: "Backend para gestion de tareas con operaciones basicas y persistencia.",
    problem: "Organiza tareas y su estado de forma centralizada.",
    stack: ["Java", "Spring Boot", "MySQL"],
    features: ["CRUD de tareas", "Validaciones", "Endpoints REST"],
    learned: "Estructura de API con Spring Boot y buenas practicas de validacion.",
    githubUrl: "https://github.com/vpablo89/todoappbackend",
  },
]
