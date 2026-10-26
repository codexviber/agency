import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { authMiddleware } from "@/lib/auth/middleware";
import type { AdminBundle, PublicSite } from "./cms-types";

const socialSchema = z.object({
  label: z.string(),
  url: z.string(),
});

const approachSchema = z.object({
  title: z.string(),
  body: z.string(),
});

const projectSchema = z.object({
  title: z.string(),
  description: z.string(),
  category: z.string(),
  technologies: z.string(),
  demoUrl: z.string(),
  githubUrl: z.string(),
  coverData: z.string(),
  videoUrl: z.string(),
  published: z.boolean(),
});

export const getPublicSite = createServerFn({ method: "GET" }).handler(async (): Promise<PublicSite> => {
  const { loadPublicSite } = await import("./cms.server");
  return loadPublicSite();
});

export const submitInquiry = createServerFn({ method: "POST" })
  .validator(
    z.object({
      name: z.string(),
      email: z.string(),
      subject: z.string(),
      message: z.string(),
    }),
  )
  .handler(async ({ data }) => {
    const { assertSameSiteRequest } = await import("./auth/isolation.server");
    assertSameSiteRequest();
    const { saveInquiry } = await import("./cms.server");
    return saveInquiry(data);
  });

export const guardAdminLogin = createServerFn({ method: "POST" }).handler(async () => {
  const { assertSameSiteRequest } = await import("./auth/isolation.server");
  assertSameSiteRequest();
  const { guardAdminLogin: guard } = await import("./cms.server");
  return guard();
});

export const getAdminBundle = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }): Promise<AdminBundle> => {
    const { loadAdminBundle, requireAdmin } = await import("./cms.server");
    await requireAdmin(context.userId);
    return loadAdminBundle();
  });

export const updateAgency = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    z.object({
      tagline: z.string(),
      heroIntro: z.string(),
      aboutTitle: z.string(),
      aboutBody: z.string(),
      approach: z.array(approachSchema),
      email: z.string(),
      phone: z.string(),
      location: z.string(),
      socials: z.array(socialSchema),
    }),
  )
  .handler(async ({ data, context }) => {
    const { requireAdmin, saveAgency } = await import("./cms.server");
    await requireAdmin(context.userId);
    return saveAgency(data);
  });

export const updatePerson = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    z.object({
      id: z.string(),
      name: z.string(),
      role: z.string(),
      bio: z.string(),
      portfolioUrl: z.string(),
      socials: z.array(socialSchema),
    }),
  )
  .handler(async ({ data, context }) => {
    const { requireAdmin, savePerson } = await import("./cms.server");
    await requireAdmin(context.userId);
    return savePerson(data);
  });

export const updateService = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    z.object({
      id: z.number(),
      title: z.string(),
      description: z.string(),
      detailsUrl: z.string(),
      visible: z.boolean(),
    }),
  )
  .handler(async ({ data, context }) => {
    const { requireAdmin, saveService } = await import("./cms.server");
    await requireAdmin(context.userId);
    return saveService(data);
  });

export const createProject = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(projectSchema)
  .handler(async ({ data, context }) => {
    const { createProject: create, requireAdmin } = await import("./cms.server");
    await requireAdmin(context.userId);
    return create(data);
  });

export const updateProject = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(projectSchema.extend({ id: z.number() }))
  .handler(async ({ data, context }) => {
    const { requireAdmin, updateProject: update } = await import("./cms.server");
    await requireAdmin(context.userId);
    return update(data);
  });

export const deleteProject = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(z.object({ id: z.number() }))
  .handler(async ({ data, context }) => {
    const { removeProject, requireAdmin } = await import("./cms.server");
    await requireAdmin(context.userId);
    return removeProject(data.id);
  });

export const updateInquiry = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    z.object({
      id: z.number(),
      status: z.enum(["new", "read", "archived"]),
    }),
  )
  .handler(async ({ data, context }) => {
    const { requireAdmin, setInquiryStatus } = await import("./cms.server");
    await requireAdmin(context.userId);
    return setInquiryStatus(data.id, data.status);
  });

export const deleteInquiry = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(z.object({ id: z.number() }))
  .handler(async ({ data, context }) => {
    const { removeInquiry, requireAdmin } = await import("./cms.server");
    await requireAdmin(context.userId);
    return removeInquiry(data.id);
  });
