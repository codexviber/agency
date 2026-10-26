import { a as getServerFnById, i as TSS_SERVER_FUNCTION, r as createServerFn } from "./ssr.mjs";
import { A as boolean, D as _enum, F as object, P as number, R as string, k as array } from "../_libs/@better-auth/core+[...].mjs";
import { t as authMiddleware } from "./middleware-BVp8M53x.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/cms.functions-CFr8DSCt.js
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
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
var getPublicSite = createServerFn({ method: "GET" }).handler(createSsrRpc("d21c6c2ed3a0815f1c8701fa734f57f8c42b09925c3a1c456c6ae3544a6d0809"));
var submitInquiry = createServerFn({ method: "POST" }).validator(object({
	name: string(),
	email: string(),
	subject: string(),
	message: string()
})).handler(createSsrRpc("6431bc6e327768541e9dd1f944f93ea2e29834ae73238aa779b35dee8616a207"));
var guardAdminLogin = createServerFn({ method: "POST" }).handler(createSsrRpc("892b9df7801a27524b17d777a6ab6a640d749de87fd41f84d7ad15eac69f814f"));
var getAdminBundle = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("06aa7c177facec4efa6177144b4861575c76a8e28512ceb8ef343b301dbbadc4"));
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
})).handler(createSsrRpc("e3ddc2062e548b4e28e58ca4455c598206b8175a89f5c4166bfcf0604120a01c"));
var updatePerson = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({
	id: string(),
	name: string(),
	role: string(),
	bio: string(),
	portfolioUrl: string(),
	socials: array(socialSchema)
})).handler(createSsrRpc("300e3741f7bf264c978fa39c4d2fd1c9c82ed1493dd1449af7811784f6e8b71a"));
var updateService = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({
	id: number(),
	title: string(),
	description: string(),
	detailsUrl: string(),
	visible: boolean()
})).handler(createSsrRpc("e7f9966efbef2d8ef7e36027707df23119cbbc0bbff221dec4726422152239f5"));
var createProject = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(projectSchema).handler(createSsrRpc("b8bdcdf2e0e4252a807fec5df6a3ce1535a5edba873090e83a8aaae8e9162d5b"));
var updateProject = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(projectSchema.extend({ id: number() })).handler(createSsrRpc("d48c8854c6125ec89681f076341563e96e43f139ebfdea949378cd618c738a32"));
var deleteProject = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({ id: number() })).handler(createSsrRpc("e0bc9c451cc48d0132dcab7e1c161aeb172f5a0d88896fc460159e34eb3aa15a"));
var updateInquiry = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({
	id: number(),
	status: _enum([
		"new",
		"read",
		"archived"
	])
})).handler(createSsrRpc("a505a9a3726ab4f90491fbc7fefcf114f50bbcad52fd3068ed56b0a2a82b646b"));
var deleteInquiry = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({ id: number() })).handler(createSsrRpc("4d47e306711dcba4cbb0faefa52d086de77717b96c99966dfc5683b81cf4c885"));
//#endregion
export { getPublicSite as a, updateAgency as c, updateProject as d, updateService as f, getAdminBundle as i, updateInquiry as l, deleteInquiry as n, guardAdminLogin as o, deleteProject as r, submitInquiry as s, createProject as t, updatePerson as u };
