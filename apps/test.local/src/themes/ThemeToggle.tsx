import {changeTheme, theme} from "../libs/theme.js";

const ThemeToggle = () => {
    return (
        <div class="dropdown dropdown-start">
            <div tabIndex={0} role="button" class="btn btn-ghost gap-1 normal-case">
                <span class="text-xl">
                    {theme() === "light" ? "☀️" : theme() === "dark" ? "🌙" : "🖥"}
                </span>
                <span class="hidden md:inline">Theme</span>
                <svg width="12px" height="12px" class="ml-1 hidden h-3 w-3 fill-current opacity-60 sm:inline-block"
                     xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2048 2048">
                    <path d="M1799 349l242 241-1017 1017L7 590l242-241 775 775 775-775z"></path>
                </svg>
            </div>
            <div tabIndex={0} class="dropdown-content z-[1] menu p-2 shadow bg-base-200 rounded-box w-52">
                <div class="grid grid-cols-1 gap-3 p-3">
                    <button
                        class={`flex items-center px-3 py-2 rounded-md ${theme() === 'light' ? 'bg-primary text-primary-content' : 'hover:bg-base-300'}`}
                        onClick={() => changeTheme("light")}
                    >
                        <span class="mr-2 text-lg">☀️</span>
                        Light
                    </button>
                    <button
                        class={`flex items-center px-3 py-2 rounded-md ${theme() === 'dark' ? 'bg-primary text-primary-content' : 'hover:bg-base-300'}`}
                        onClick={() => changeTheme("dark")}
                    >
                        <span class="mr-2 text-lg">🌙</span>
                        Dark
                    </button>
                    <button
                        class={`flex items-center px-3 py-2 rounded-md ${theme() === 'system' ? 'bg-primary text-primary-content' : 'hover:bg-base-300'}`}
                        onClick={() => changeTheme("system")}
                    >
                        <span class="mr-2 text-lg">🖥</span>
                        System
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ThemeToggle;
