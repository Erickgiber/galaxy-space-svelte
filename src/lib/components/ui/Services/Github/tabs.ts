import type { ITabs } from "$lib/types/components/Tabs/tabst.types";
import Repos from "./components/Repos.svelte";

export const TabsGithubPage: ITabs[] = [
    {
        id: 1,
        content: Repos,
        icon: 'iconoir:repository',
        title: 'Repositories'
    }
]