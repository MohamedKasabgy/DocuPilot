import { z } from "zod";

export const SrsSchema = z.object({
  projectBrief: z.object({
    projectName: z.string(),
    clientName: z.string().nullable(),
    industry: z.string(),
    complexity: z.enum(["low", "medium", "high"]),
    summary: z.string(),
  }),
  userRoles: z.array(
    z.object({
      role: z.string(),
      description: z.string(),
      permissions: z.array(z.string()),
    })
  ),
  mainFeatures: z.array(
    z.object({
      title: z.string(),
      description: z.string(),
      priority: z.enum(["low", "medium", "high", "critical"]),
    })
  ),
  functionalRequirements: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      description: z.string(),
      priority: z.enum(["low", "medium", "high", "critical"]),
    })
  ),
  nonFunctionalRequirements: z.array(
    z.object({
      category: z.string(),
      requirement: z.string(),
    })
  ),
  missingQuestions: z.array(z.string()),
  mvpScope: z.array(z.string()),
  assumptions: z.array(z.string()),
  confidenceScore: z.number().min(0).max(100),
});

export type SrsOutput = z.infer<typeof SrsSchema>;

export const srsJsonSchema = {
  type: "object",
  properties: {
    projectBrief: {
      type: "object",
      properties: {
        projectName: { type: "string" },
        clientName: { type: "string", nullable: true },
        industry: { type: "string" },
        complexity: { type: "string", enum: ["low", "medium", "high"] },
        summary: { type: "string" },
      },
      required: ["projectName", "industry", "complexity", "summary"],
    },
    userRoles: {
      type: "array",
      items: {
        type: "object",
        properties: {
          role: { type: "string" },
          description: { type: "string" },
          permissions: { type: "array", items: { type: "string" } },
        },
        required: ["role", "description", "permissions"],
      },
    },
    mainFeatures: {
      type: "array",
      items: {
        type: "object",
        properties: {
          title: { type: "string" },
          description: { type: "string" },
          priority: { type: "string", enum: ["low", "medium", "high", "critical"] },
        },
        required: ["title", "description", "priority"],
      },
    },
    functionalRequirements: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "string" },
          title: { type: "string" },
          description: { type: "string" },
          priority: { type: "string", enum: ["low", "medium", "high", "critical"] },
        },
        required: ["id", "title", "description", "priority"],
      },
    },
    nonFunctionalRequirements: {
      type: "array",
      items: {
        type: "object",
        properties: {
          category: { type: "string" },
          requirement: { type: "string" },
        },
        required: ["category", "requirement"],
      },
    },
    missingQuestions: { type: "array", items: { type: "string" } },
    mvpScope: { type: "array", items: { type: "string" } },
    assumptions: { type: "array", items: { type: "string" } },
    confidenceScore: { type: "number" },
  },
  required: [
    "projectBrief",
    "userRoles",
    "mainFeatures",
    "functionalRequirements",
    "nonFunctionalRequirements",
    "missingQuestions",
    "mvpScope",
    "assumptions",
    "confidenceScore",
  ],
};
