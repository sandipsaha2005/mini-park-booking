import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

const swaggerHtml = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Mini Park Booking API Docs</title>
    <link
      rel="stylesheet"
      href="https://unpkg.com/swagger-ui-dist@5/swagger-ui.css"
    />
    <style>
      html, body, #swagger-ui { margin: 0; padding: 0; height: 100%; }
    </style>
  </head>
  <body>
    <div id="swagger-ui"></div>
    <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
    <script>
      window.ui = SwaggerUIBundle({
        url: "/internal/docs",
        dom_id: "#swagger-ui",
        deepLinking: true,
        displayRequestDuration: true,
        docExpansion: "list",
        persistAuthorization: true
      });
    </script>
  </body>
</html>`

export const GET = async (_req: MedusaRequest, res: MedusaResponse) => {
  res.setHeader("Content-Type", "text/html; charset=utf-8")
  res.send(swaggerHtml)
}
