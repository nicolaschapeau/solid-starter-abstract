import {children, JSXElement} from "solid-js";
import ThemeToggle from "../themes/ThemeToggle.js";

const DefaultLayout = (props: { children: JSXElement }) => {
    const resolved = children(() => props.children)

    return (
        <div class="px-6 py-12 bg-base-200 min-h-screen">
            <ThemeToggle/>
            {resolved()}
        </div>
    )
}

export default DefaultLayout;