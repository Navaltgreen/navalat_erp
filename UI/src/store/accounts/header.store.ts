import { create } from "zustand";
type Project = {
  id: number;
  name: string;
};

type AccountsHeaderStoreState = {
  projects: Project[];
  selectedProjectId: number | null;
  setProjects: (projects: Project[]) => void;
  setSelectedProjectId: (id: number | null) => void;
};
const useAccountsHeaderStore = create<AccountsHeaderStoreState>((set) => ({
  projects: [],
  selectedProjectId: null,
  setProjects: (projects) =>
    set({
      projects,
      selectedProjectId: projects.length ? projects[0].id : null,
    }),

  setSelectedProjectId: (id) =>
    set({
      selectedProjectId: id,
    }),
}));
export default useAccountsHeaderStore;
