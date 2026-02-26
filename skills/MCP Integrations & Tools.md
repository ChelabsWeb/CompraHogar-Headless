# Skill: MCP Integrations & Tools

**Versión:** 1.0.0
**Contexto:** Integración de servidores Model Context Protocol (MCP) en el flujo de desarrollo de Antigravity.
**Objetivo:** Extender las capacidades de la IA mediante servidores MCP para interactuar directamente con Shopify, GitHub y entornos de despliegue.

---

## 🔌 Servidores MCP para E-commerce Headless

| Servidor              | Utilidad para Headless                                                                                                                  | Instalación (ejemplo)                     |
| :-------------------- | :-------------------------------------------------------------------------------------------------------------------------------------- | :---------------------------------------- |
| **Shopify Dev MCP**   | Oficial. Permite a la IA consultar la documentación de Shopify, esquemas de la Storefront API y resolver dudas técnicas sin alucinar.   | `npx -y @shopify/dev-mcp@latest`          |
| **Shopify Admin MCP** | Ideal para gestionar el backend (productos, colecciones, metafields) directamente desde el chat de tu IDE.                              | `@akson/mcp-shopify` o similares.         |
| **GitHub MCP**        | Fundamental para manejar el flujo de Antigravity, ramas de Git y PRs de forma automática.                                               | `@modelcontextprotocol/server-github`     |
| **Cloudflare MCP**    | Si usas Oxygen o Cloudflare Workers para el despliegue de tu storefront, este server ayuda a gestionar variables de entorno y recursos. | `@modelcontextprotocol/server-cloudflare` |

---

## 📋 Directrices de Uso de MCP

### 1. Consultas sobre la API de Shopify
- **Regla:** Ante cualquier duda sobre la estructura de la Storefront API o Admin API, consultar primero a través del MCP en lugar de asumir la respuesta.
- **Acción:** Utilizar el `Shopify Dev MCP` para obtener las definiciones exactas de GraphQL actualizadas.

### 2. Gestión del Código Fuente
- **Regla:** Automatizar tareas repetitivas de control de versiones.
- **Acción:** Usar el `GitHub MCP` para la creación de Pull Requests, resolución de conflictos o revisión de historial cuando se trabaje en equipo.

### 3. Operaciones de Backend Storefront
- **Regla:** Sincronizar el estado del CMS de Shopify con la UI de desarrollo.
- **Acción:** Emplear el `Shopify Admin MCP` para verificar rápidamente si un metafield existe o si un producto está correctamente configurado sin salir del IDE.

🚫 **Restricciones Críticas (No Incumplir)**
- **Dependencia a ciegas:** No ejecutar comandos destructivos (como borrado de repositorios o eliminación masiva de productos vía Admin) sin confirmación explícita del usuario, incluso si el MCP lo permite.
- **Gestión de variables:** Mantener los tokens de acceso de estos servidores cuidadosamente en `.env` locales ignorados (como el que ya tenemos); nunca exponer las keys de admin de Shopify o Github en el código cliente.
