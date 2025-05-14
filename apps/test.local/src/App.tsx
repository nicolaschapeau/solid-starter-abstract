import {QueryClient, QueryClientProvider} from "@tanstack/solid-query";
import {Posts} from "./posts/views/posts.js";
import {Route, Router} from "@solidjs/router";
import {OnePost} from "./posts/views/one.js";
import {onMount} from "solid-js";
import {initTheme} from "./libs/theme.js";

const queryClient = new QueryClient()

export default function App() {
    onMount(() => initTheme());

    return (
        <QueryClientProvider client={queryClient}>
            <Router>
                <Route path="/" component={Posts}/>
                <Route path="/:id" component={OnePost}/>
            </Router>
        </QueryClientProvider>
    );
};

