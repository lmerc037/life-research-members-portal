// Make sure these start with forward slash '/' - indicates domain root
const ApiRoutes = {
  allMembers: "/api/all-members",
  allAccounts: "/api/all-accounts",
  registerAccount: "/api/register-account",
  activeAccount: "/api/active-account",
  account: (id: number) => "/api/account/" + id,
  publicMemberInfo: (id: number) => "/api/member/" + id + "/public",
  privateMemberInfo: (id: number) => "/api/member/" + id + "/private",
  deleteAccount: (id: number) => "/api/delete-account/" + id,
  updateAccount: (id: number) => "/api/update-account/" + id,
  deleteMember: (id: number) => "/api/delete-member/" + id,
  updateMemberPublic: (id: number) => "/api/update-member/" + id + "/public",
  updateMemberPrivate: (id: number) => "/api/update-member/" + id + "/private",
  updateMemberInsight: (id: number) => "/api/update-member/" + id + "/insight",
  updateKeyword: (id: number) => "/api/update-keyword/" + id,
  registerMember: "/api/register-member",
  registerKeyword: "/api/register-keyword",
  allKeywords: "/api/all-keywords",
  allFaculties: "/api/all-faculties",
  allMemberTypes: "/api/all-member-types",
};

export default ApiRoutes;
