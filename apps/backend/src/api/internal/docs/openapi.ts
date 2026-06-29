import {
  OpenAPIRegistry,
  OpenApiGeneratorV3,
  extendZodWithOpenApi,
} from "@asteasolutions/zod-to-openapi"
import { z } from "zod"

extendZodWithOpenApi(z)

const ErrorResponseSchema = z.object({
  error: z.string().openapi({ example: "Something went wrong" }),
})

const UnauthorizedErrorSchema = z.object({
  error: z.string().openapi({ example: "Unauthorized" }),
})

const ValidationErrorSchema = z.object({
  error: z.literal("Validation failed"),
  issues: z.array(
    z.object({
      field: z.string().openapi({ example: "quantity" }),
      message: z.string().openapi({ example: "quantity must be at least 1" }),
    })
  ),
})

const TicketSchema = z.object({
  id: z.string(),
  name: z.string(),
  price: z.number().nullable().optional(),
  available_quantity: z.number().int().optional(),
  visit_date: z.string().optional(),
  status: z.string().optional(),
  product_variant: z.record(z.string(), z.unknown()).nullable().optional(),
})

const ParkSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().nullable().optional(),
  slug: z.string().nullable().optional(),
})

const SyncResultSchema = z.object({
  success: z.boolean(),
  park_id: z.string().optional(),
  reason: z.string().optional(),
})

const BookingInputSchema = z.object({
  ticket_id: z.string().min(1).openapi({ example: "ticket_123" }),
  quantity: z.number().int().positive().max(10).openapi({ example: 2 }),
  customer_email: z.string().email().openapi({ example: "customer@example.com" }),
})

const BookingResponseSchema = z.object({
  booking: z.record(z.string(), z.unknown()),
})

const CustomerAuthInputSchema = z.object({
  email: z.string().email().openapi({ example: "customer@example.com" }),
  password: z.string().min(8).openapi({ example: "strongPassword123" }),
})

const CustomerAuthTokenResponseSchema = z.object({
  token: z.string().openapi({ example: "jwt_or_session_token" }),
})

const TicketLinkInputSchema = z.object({
  variant_id: z.string().min(1).openapi({ example: "variant_123" }),
})

const TicketLinkResponseSchema = z.object({
  message: z.literal("Linked successfully"),
  ticketId: z.string(),
  variant_id: z.string(),
})

type OpenApiDocument = ReturnType<OpenApiGeneratorV3["generateDocument"]>

export const buildInternalOpenApiDocument = (): OpenApiDocument => {
  const registry = new OpenAPIRegistry()

  registry.register("ErrorResponse", ErrorResponseSchema)
  registry.register("UnauthorizedError", UnauthorizedErrorSchema)
  registry.register("ValidationError", ValidationErrorSchema)
  registry.register("Ticket", TicketSchema)
  registry.register("Park", ParkSchema)
  registry.register("SyncResult", SyncResultSchema)
  registry.register("CreateBookingInput", BookingInputSchema)
  registry.register("CreateBookingResponse", BookingResponseSchema)
  registry.register("CustomerAuthInput", CustomerAuthInputSchema)
  registry.register("CustomerAuthTokenResponse", CustomerAuthTokenResponseSchema)
  registry.register("TicketLinkInput", TicketLinkInputSchema)
  registry.register("TicketLinkResponse", TicketLinkResponseSchema)
  registry.registerComponent("securitySchemes", "customerBearerAuth", {
    type: "http",
    scheme: "bearer",
    bearerFormat: "JWT",
    description: "Customer bearer token or authenticated session.",
  })
  registry.registerComponent("securitySchemes", "internalApiKey", {
    type: "apiKey",
    in: "header",
    name: "x-api-key",
    description: "Internal API key for non-public endpoints.",
  })
  registry.registerComponent("securitySchemes", "publishableApiKey", {
    type: "apiKey",
    in: "header",
    name: "x-publishable-api-key",
    description:
      "Publishable API key required in request header. Manage keys in dashboard settings.",
  })

  registry.registerPath({
    method: "post",
    path: "/store/bookings",
    tags: ["bookings", "store"],
    summary: "Create a booking for the authenticated customer",
    security: [{ customerBearerAuth: [], publishableApiKey: [] }],
    request: {
      body: {
        required: true,
        description: "Booking request payload",
        content: {
          "application/json": {
            schema: BookingInputSchema,
          },
        },
      },
    },
    responses: {
      200: {
        description: "Booking created",
        content: {
          "application/json": {
            schema: BookingResponseSchema,
          },
        },
      },
      400: {
        description: "Request body validation failed",
        content: {
          "application/json": {
            schema: ValidationErrorSchema,
          },
        },
      },
      401: {
        description:
          "Missing or invalid customer auth and/or missing x-publishable-api-key",
        content: {
          "application/json": {
            schema: UnauthorizedErrorSchema,
          },
        },
      },
      500: {
        description: "Unexpected server error",
        content: {
          "application/json": {
            schema: ErrorResponseSchema,
          },
        },
      },
    },
  })

  registry.registerPath({
    method: "post",
    path: "/auth/customer/emailpass/register",
    tags: ["auth", "customer-auth"],
    summary: "Register customer credentials (Medusa auth)",
    request: {
      body: {
        required: true,
        description: "Customer email/password used for credential registration",
        content: {
          "application/json": {
            schema: CustomerAuthInputSchema,
          },
        },
      },
    },
    responses: {
      200: {
        description: "Customer auth credentials registered",
        content: {
          "application/json": {
            schema: CustomerAuthTokenResponseSchema,
          },
        },
      },
      400: {
        description: "Invalid registration payload",
        content: {
          "application/json": {
            schema: ErrorResponseSchema,
          },
        },
      },
      409: {
        description: "Customer auth credentials already exist",
        content: {
          "application/json": {
            schema: ErrorResponseSchema,
          },
        },
      },
      500: {
        description: "Unexpected server error",
        content: {
          "application/json": {
            schema: ErrorResponseSchema,
          },
        },
      },
    },
  })

  registry.registerPath({
    method: "post",
    path: "/auth/customer/emailpass",
    tags: ["auth", "customer-auth"],
    summary: "Login customer with email/password (Medusa auth)",
    request: {
      body: {
        required: true,
        description: "Customer login credentials",
        content: {
          "application/json": {
            schema: CustomerAuthInputSchema,
          },
        },
      },
    },
    responses: {
      200: {
        description: "Customer authenticated",
        content: {
          "application/json": {
            schema: CustomerAuthTokenResponseSchema,
          },
        },
      },
      401: {
        description: "Invalid credentials",
        content: {
          "application/json": {
            schema: UnauthorizedErrorSchema,
          },
        },
      },
      500: {
        description: "Unexpected server error",
        content: {
          "application/json": {
            schema: ErrorResponseSchema,
          },
        },
      },
    },
  })

  registry.registerPath({
    method: "get",
    path: "/tickets",
    tags: ["tickets"],
    summary: "List all tickets",
    responses: {
      200: {
        description: "Tickets list",
        content: {
          "application/json": {
            schema: z.object({ tickets: z.array(TicketSchema) }),
          },
        },
      },
      500: {
        description: "Unexpected server error",
        content: {
          "application/json": {
            schema: ErrorResponseSchema,
          },
        },
      },
    },
  })

  registry.registerPath({
    method: "post",
    path: "/tickets",
    tags: ["tickets"],
    summary: "Create a ticket",
    request: {
      body: {
        required: true,
        description: "Ticket payload accepted by ticket service",
        content: {
          "application/json": {
            schema: z.record(z.string(), z.unknown()),
          },
        },
      },
    },
    responses: {
      200: {
        description: "Created ticket",
        content: {
          "application/json": {
            schema: z.object({ ticket: TicketSchema }),
          },
        },
      },
      400: {
        description: "Invalid request payload",
        content: {
          "application/json": {
            schema: ErrorResponseSchema,
          },
        },
      },
      500: {
        description: "Unexpected server error",
        content: {
          "application/json": {
            schema: ErrorResponseSchema,
          },
        },
      },
    },
  })

  registry.registerPath({
    method: "get",
    path: "/tickets/{id}",
    tags: ["tickets"],
    summary: "Get a ticket by ID",
    request: {
      params: z.object({
        id: z.string().openapi({ example: "ticket_123" }),
      }),
    },
    responses: {
      200: {
        description: "Ticket details",
        content: {
          "application/json": {
            schema: z.object({ ticket: TicketSchema.nullable() }),
          },
        },
      },
      404: {
        description: "Ticket not found",
        content: {
          "application/json": {
            schema: ErrorResponseSchema,
          },
        },
      },
      500: {
        description: "Unexpected server error",
        content: {
          "application/json": {
            schema: ErrorResponseSchema,
          },
        },
      },
    },
  })

  registry.registerPath({
    method: "post",
    path: "/tickets/{id}/link",
    tags: ["tickets"],
    summary: "Link a ticket with a product variant",
    request: {
      params: z.object({
        id: z.string().openapi({ example: "ticket_123" }),
      }),
      body: {
        required: true,
        description: "Variant linkage payload",
        content: {
          "application/json": {
            schema: TicketLinkInputSchema,
          },
        },
      },
    },
    responses: {
      200: {
        description: "Link created",
        content: {
          "application/json": {
            schema: TicketLinkResponseSchema,
          },
        },
      },
      400: {
        description: "Invalid request payload",
        content: {
          "application/json": {
            schema: ErrorResponseSchema,
          },
        },
      },
      500: {
        description: "Unexpected server error",
        content: {
          "application/json": {
            schema: ErrorResponseSchema,
          },
        },
      },
    },
  })

  registry.registerPath({
    method: "get",
    path: "/internal/parks",
    tags: ["internal", "parks"],
    summary: "List parks from the park module",
    security: [{ internalApiKey: [] }],
    responses: {
      200: {
        description: "Parks list",
        content: {
          "application/json": {
            schema: z.object({ parks: z.array(ParkSchema) }),
          },
        },
      },
      401: {
        description: "Invalid internal API key",
        content: {
          "application/json": {
            schema: UnauthorizedErrorSchema,
          },
        },
      },
      500: {
        description: "Unexpected server error",
        content: {
          "application/json": {
            schema: ErrorResponseSchema,
          },
        },
      },
    },
  })

  registry.registerPath({
    method: "post",
    path: "/internal/cms/sync",
    tags: ["internal", "cms"],
    summary: "Sync parks from CMS to internal module",
    security: [{ internalApiKey: [] }],
    responses: {
      200: {
        description: "Sync finished",
        content: {
          "application/json": {
            schema: z.object({
              message: z.literal("Sync complete"),
              synced: z.number().int(),
              results: z.array(SyncResultSchema),
            }),
          },
        },
      },
      401: {
        description: "Invalid internal API key",
        content: {
          "application/json": {
            schema: UnauthorizedErrorSchema,
          },
        },
      },
      500: {
        description: "Unexpected server error",
        content: {
          "application/json": {
            schema: ErrorResponseSchema,
          },
        },
      },
    },
  })

  registry.registerPath({
    method: "get",
    path: "/admin/custom",
    tags: ["admin"],
    summary: "Custom admin health endpoint",
    responses: {
      200: {
        description: "Endpoint reachable",
      },
      401: {
        description: "Admin auth required",
        content: {
          "application/json": {
            schema: UnauthorizedErrorSchema,
          },
        },
      },
    },
  })

  registry.registerPath({
    method: "get",
    path: "/store/custom",
    tags: ["store"],
    summary: "Custom store health endpoint",
    responses: {
      200: {
        description: "Endpoint reachable",
      },
      500: {
        description: "Unexpected server error",
        content: {
          "application/json": {
            schema: ErrorResponseSchema,
          },
        },
      },
    },
  })

  const generator = new OpenApiGeneratorV3(registry.definitions)
  return generator.generateDocument({
    openapi: "3.0.3",
    info: {
      title: "Mini Park Booking Internal API",
      version: "1.0.0",
      description:
        "Internal API documentation for current custom Medusa routes in this backend.",
    },
    servers: [
      {
        url: process.env.MEDUSA_BACKEND_URL || "http://localhost:9000",
        description: "Backend base URL",
      },
    ],
    tags: [
      { name: "bookings", description: "Store booking endpoints" },
      { name: "tickets", description: "Ticket management endpoints" },
      { name: "internal", description: "Internal protected endpoints" },
      { name: "cms", description: "CMS sync operations" },
      { name: "parks", description: "Park listing operations" },
      { name: "admin", description: "Custom admin endpoints" },
      { name: "store", description: "Custom store endpoints" },
      { name: "auth", description: "Authentication endpoints" },
      { name: "customer-auth", description: "Customer auth credential endpoints" },
    ],
  })
}
