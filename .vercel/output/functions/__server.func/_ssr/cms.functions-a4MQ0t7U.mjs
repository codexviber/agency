import { i as TSS_SERVER_FUNCTION, r as createServerFn } from "./ssr.mjs";
import { A as boolean, D as _enum, F as object, P as number, R as string, k as array } from "../_libs/@better-auth/core+[...].mjs";
import { t as authMiddleware } from "./middleware-BVp8M53x.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/cms.functions-a4MQ0t7U.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var socialSchema = object({
	label: string(),
	url: string()
});
var approachSchema = object({
	title: string(),
	body: string()
});
var projectSchema = object({
	title: string(),
	description: string(),
	category: string(),
	technologies: string(),
	demoUrl: string(),
	githubUrl: string(),
	coverData: string(),
	videoUrl: string(),
	published: boolean()
});
var getPublicSite_createServerFn_handler = createServerRpc({
	id: "d21c6c2ed3a0815f1c8701fa734f57f8c42b09925c3a1c456c6ae3544a6d0809",
	name: "getPublicSite",
	filename: "src/lib/cms.functions.ts"
}, (opts) => getPublicSite.__executeServer(opts));
var getPublicSite = createServerFn({ method: "GET" }).handler(getPublicSite_createServerFn_handler, async () => {
	const { loadPublicSite } = await import("./cms.server-KLK5xjB3.mjs");
	return loadPublicSite();
});
var submitInquiry_createServerFn_handler = createServerRpc({
	id: "6431bc6e327768541e9dd1f944f93ea2e29834ae73238aa779b35dee8616a207",
	name: "submitInquiry",
	filename: "src/lib/cms.functions.ts"
}, (opts) => submitInquiry.__executeServer(opts));
var submitInquiry = createServerFn({ method: "POST" }).validator(object({
	name: string(),
	email: string(),
	subject: string(),
	message: string()
})).handler(submitInquiry_createServerFn_handler, async ({ data }) => {
	const { assertSameSiteRequest } = await import("./isolation.server-CGNg1r0B.mjs");
	assertSameSiteRequest();
	const { saveInquiry } = await import("./cms.server-KLK5xjB3.mjs");
	return saveInquiry(data);
});
var guardAdminLogin_createServerFn_handler = createServerRpc({
	id: "892b9df7801a27524b17d777a6ab6a640d749de87fd41f84d7ad15eac69f814f",
	name: "guardAdminLogin",
	filename: "src/lib/cms.functions.ts"
}, (opts) => guardAdminLogin.__executeServer(opts));
var guardAdminLogin = createServerFn({ method: "POST" }).handler(guardAdminLogin_createServerFn_handler, async () => {
	const { assertSameSiteRequest } = await import("./isolation.server-CGNg1r0B.mjs");
	assertSameSiteRequest();
	const { guardAdminLogin: guard } = await import("./cms.server-KLK5xjB3.mjs");
	return guard();
});
var getAdminBundle_createServerFn_handler = createServerRpc({
	id: "06aa7c177facec4efa6177144b4861575c76a8e28512ceb8ef343b301dbbadc4",
	name: "getAdminBundle",
	filename: "src/lib/cms.functions.ts"
}, (opts) => getAdminBundle.__executeServer(opts));
var getAdminBundle = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(getAdminBundle_createServerFn_handler, async ({ context }) => {
	const { loadAdminBundle, requireAdmin } = await import("./cms.server-KLK5xjB3.mjs");
	await requireAdmin(context.userId);
	return loadAdminBundle();
});
var updateAgency_createServerFn_handler = createServerRpc({
	id: "e3ddc2062e548b4e28e58ca4455c598206b8175a89f5c4166bfcf0604120a01c",
	name: "updateAgency",
	filename: "src/lib/cms.functions.ts"
}, (opts) => updateAgency.__executeServer(opts));
var updateAgency = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({
	tagline: string(),
	heroIntro: string(),
	aboutTitle: string(),
	aboutBody: string(),
	approach: array(approachSchema),
	email: string(),
	phone: string(),
	location: string(),
	socials: array(socialSchema)
})).handler(updateAgency_createServerFn_handler, async ({ data, context }) => {
	const { requireAdmin, saveAgency } = await import("./cms.server-KLK5xjB3.mjs");
	await requireAdmin(context.userId);
	return saveAgency(data);
});
var updatePerson_createServerFn_handler = createServerRpc({
	id: "300e3741f7bf264c978fa39c4d2fd1c9c82ed1493dd1449af7811784f6e8b71a",
	name: "updatePerson",
	filename: "src/lib/cms.functions.ts"
}, (opts) => updatePerson.__executeServer(opts));
var updatePerson = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({
	id: string(),
	name: string(),
	role: string(),
	bio: string(),
	portfolioUrl: string(),
	socials: array(socialSchema)
})).handler(updatePerson_createServerFn_handler, async ({ data, context }) => {
	const { requireAdmin, savePerson } = await import("./cms.server-KLK5xjB3.mjs");
	await requireAdmin(context.userId);
	return savePerson(data);
});
var updateService_createServerFn_handler = createServerRpc({
	id: "e7f9966efbef2d8ef7e36027707df23119cbbc0bbff221dec4726422152239f5",
	name: "updateService",
	filename: "src/lib/cms.functions.ts"
}, (opts) => updateService.__executeServer(opts));
var updateService = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({
	id: number(),
	title: string(),
	description: string(),
	detailsUrl: string(),
	visible: boolean()
})).handler(updateService_createServerFn_handler, async ({ data, context }) => {
	const { requireAdmin, saveService } = await import("./cms.server-KLK5xjB3.mjs");
	await requireAdmin(context.userId);
	return saveService(data);
});
var createProject_createServerFn_handler = createServerRpc({
	id: "b8bdcdf2e0e4252a807fec5df6a3ce1535a5edba873090e83a8aaae8e9162d5b",
	name: "createProject",
	filename: "src/lib/cms.functions.ts"
}, (opts) => createProject.__executeServer(opts));
var createProject = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(projectSchema).handler(createProject_createServerFn_handler, async ({ data, context }) => {
	const { createProject: create, requireAdmin } = await import("./cms.server-KLK5xjB3.mjs");
	await requireAdmin(context.userId);
	return create(data);
});
var updateProject_createServerFn_handler = createServerRpc({
	id: "d48c8854c6125ec89681f076341563e96e43f139ebfdea949378cd618c738a32",
	name: "updateProject",
	filename: "src/lib/cms.functions.ts"
}, (opts) => updateProject.__executeServer(opts));
var updateProject = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(projectSchema.extend({ id: number() })).handler(updateProject_createServerFn_handler, async ({ data, context }) => {
	const { requireAdmin, updateProject: update } = await import("./cms.server-KLK5xjB3.mjs");
	await requireAdmin(context.userId);
	return update(data);
});
var deleteProject_createServerFn_handler = createServerRpc({
	id: "e0bc9c451cc48d0132dcab7e1c161aeb172f5a0d88896fc460159e34eb3aa15a",
	name: "deleteProject",
	filename: "src/lib/cms.functions.ts"
}, (opts) => deleteProject.__executeServer(opts));
var deleteProject = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({ id: number() })).handler(deleteProject_createServerFn_handler, async ({ data, context }) => {
	const { removeProject, requireAdmin } = await import("./cms.server-KLK5xjB3.mjs");
	await requireAdmin(context.userId);
	return removeProject(data.id);
});
var updateInquiry_createServerFn_handler = createServerRpc({
	id: "a505a9a3726ab4f90491fbc7fefcf114f50bbcad52fd3068ed56b0a2a82b646b",
	name: "updateInquiry",
	filename: "src/lib/cms.functions.ts"
}, (opts) => updateInquiry.__executeServer(opts));
var updateInquiry = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({
	id: number(),
	status: _enum([
		"new",
		"read",
		"archived"
	])
})).handler(updateInquiry_createServerFn_handler, async ({ data, context }) => {
	const { requireAdmin, setInquiryStatus } = await import("./cms.server-KLK5xjB3.mjs");
	await requireAdmin(context.userId);
	return setInquiryStatus(data.id, data.status);
});
var deleteInquiry_createServerFn_handler = createServerRpc({
	id: "4d47e306711dcba4cbb0faefa52d086de77717b96c99966dfc5683b81cf4c885",
	name: "deleteInquiry",
	filename: "src/lib/cms.functions.ts"
}, (opts) => deleteInquiry.__executeServer(opts));
var deleteInquiry = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({ id: number() })).handler(deleteInquiry_createServerFn_handler, async ({ data, context }) => {
	const { removeInquiry, requireAdmin } = await import("./cms.server-KLK5xjB3.mjs");
	await requireAdmin(context.userId);
	return removeInquiry(data.id);
});
//#endregion
export { createProject_createServerFn_handler, deleteInquiry_createServerFn_handler, deleteProject_createServerFn_handler, getAdminBundle_createServerFn_handler, getPublicSite_createServerFn_handler, guardAdminLogin_createServerFn_handler, submitInquiry_createServerFn_handler, updateAgency_createServerFn_handler, updateInquiry_createServerFn_handler, updatePerson_createServerFn_handler, updateProject_createServerFn_handler, updateService_createServerFn_handler };
