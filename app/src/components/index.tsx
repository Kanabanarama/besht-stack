import * as elements from 'typed-html';
import { Item } from '../db/schema';

const BaseHtml = ({ children }: elements.Children) => `
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <script src="https://unpkg.com/htmx.org@1.9.6"></script>
        <script src="https://cdn.tailwindcss.com"></script>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/fork-awesome@1.2.0/css/fork-awesome.min.css">
        <link rel="stylesheet" href="public/css/main.css" />
        <link rel='icon' href='public/gfx/favicon.ico'  />
        <title>Hello</title>
    </head>
    <body class="p-0 bg-gray-500">
    ${children}
    </body>
</html>
`;

const LandingPage = () => {
    return (
        <div class="container p-6 mx-auto bg-gray-900">
            <Hero />
            <section id="items-overview" class="py-8 text-gray-300">
                <h2 class="text-3xl font-bold mb-6 pb-4 text-center">List of treasures</h2>
                <div
                    hx-get="/items"
                    hx-trigger="load"
                    hx-swap="innerHTML">
                </div>
                <h2 class="text-3xl font-bold mt-12 mb-6 pb-4 text-center">Add a trinket</h2>
                <ItemForm />
            </section>
            <Footer />
        </div>
    );
}

const Hero = () => {
    return (
        <div class="bg-gray-700">
            <div class="container mx-auto py-4 px-5 text-center">
                <h1 class="mb-8 text-3xl font-bold leading-snug text-white sm:text-4xl sm:leading-snug md:text-[45px] md:leading-snug">
                    Your hero
                </h1>
                <p class="text-white text-lg text-center">
                    It's spelled you're!
                </p>
            </div>
        </div>
    );
}

const Footer = () => {
    return (
        <div class="bg-gray-700">
            <div class="container mx-auto py-4 px-5 flex flex-wrap flex-col sm:flex-row">
                <p class="text-white text-sm text-center sm:text-left">
                    Made without coffee by:
                    <a href="https://eskana.de" target="_blank" class="font-bold  ml-1">
                        eskana
                    </a>
                </p>
                <span class="inline-flex sm:ml-auto sm:mt-0 mt-2 justify-center sm:justify-start">
                    <a href="https://buymeacoffee.com/kanabanarama" target="_blank" class="ml-3 text-gray-500">
                        <i class="fa fa-buymeacoffee"></i>
                    </a>
                    <a href="https:/github.com/kanabanarama" target="_blank" class="ml-3 text-gray-500">
                        <i class="fa fa-github"></i>
                    </a>
                    <a href="https://www.linkedin.com/in/ren%C3%A9-lantzsch-53a829112" target="_blank" class="ml-3 text-gray-500">
                        <i class="fa fa-linkedin"></i>
                    </a>
                    <a href="https://instagram.com/kanabanarama" target="_blank" class="ml-3 text-gray-500">
                        <i class="fa fa-instagram"></i>
                    </a>
                    <a href="https://www.youtube.com/kanabanarama" target="_blank" class="ml-3 text-gray-500">
                        <i class="fa fa-youtube"></i>
                    </a>
                    <a href="https://twitter.com/kanabanarama" target="_blank" class="ml-3 text-gray-500">
                        <i class="fa fa-twitter"></i>
                    </a>
                    <a href="https://www.facebook.com/kanabanarama" target="_blank" class="ml-3 text-gray-500">
                        <i class="fa fa-facebook-f"></i>
                    </a>
                </span>
            </div>
        </div>
    );
}

const ItemListPlaceholder = () => {
    return (
        <div class="placeholder col-span-5 text-center text-white">
            <div><i class="m-3 fa fa-5x fa-suitcase"></i></div>
            <p>Trunk is empty :(</p>
            <p>Add some trinkets!</p>
        </div>
    );
}

const ItemList = ({ items }: { items: Item[] }) => {
    return (
        <div id="items-list" class="grid lg:grid-cols-5 gap-6 xl:gap-x-12">
            {!items.length ? <ItemListPlaceholder /> : items.map((item) => (
                <ItemElement {...item} />
            ))}
        </div>
    );
}

const ItemElement = ({ id, title, content, createdAt = null }: Item) => {
    return (
        <div class="mb-6 lg:mb-0 p-5 block bg-slate-600 rounded-lg shadow-lg">
                    <div class="trinket flex justify-center items-center h-56 mb-5">
                        <div
                            class="flex justify-center items-center rounded-full bg-gray-500 text-white text-center text-5xl"
                            style={`width: ${100 + title.length}px; height: ${100 + title.length}px`}
                        >
                            {title.charAt(0).toUpperCase()}
                        </div>
                    </div>
                    <h5 class="break-all font-bold text-lg mb-3">
                        {title}
                    </h5>
                    <p class="text-gray-100 mb-4">
                        <small>Created: <span class="text-gray-400">{createdAt?.toLocaleString()}</span></small>
                    </p>
                    <button
                        hx-get={`/items/${id}`}
                        hx-swap="outerHTML"
                        hx-target="closest div"
                        data-mdb-ripple="true"
                        data-mdb-ripple-color="light"
                        class="inline-block px-4 rounded-full text-white border border-green-700 bg-transparent hover:bg-green-700 transition duration-500 ease-in-out"
                    >
                        Edit
                    </button>
                    <button
                        class="inline-block px-4 rounded-full text-white border border-red-700 bg-transparent hover:bg-red-700 transition duration-500 ease-in-out"
                        hx-delete={`/items/${id}`}
                        hx-swap="outerHTML"
                        hx-target="closest div"
                    >
                        Delete
                    </button>
        </div>
    );
}

const ItemForm = () => {
    return (
        <div class="flex justify-center">
            <div class="w-full max-w-xs bg-gray-800 text-gray-300 shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <form hx-post="/items" hx-target="#items-list" hx-swap="beforeend">
                    <div class="text-center font-semibold">
                        Add trinket
                    </div>
                    <div class="mb-3">
                        <label for="title" class="block">Title:</label>
                        <input name="title" type="text" class="px-2 rounded-full text-gray-900" />
                    </div>
                    <div class="mb-3">
                        <label for="content" class="block">Content:</label>
                        <input name="content" type="text" class="px-2 rounded-full text-gray-900" />
                    </div>
                    <div class="text-center">
                        <button type="submit" class="px-4 rounded-full text-white border border-blue-700 bg-transparent hover:bg-blue-700 transition duration-500 ease-in-out">
                            Gimme!
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export {
    BaseHtml,
    LandingPage,
    Hero,
    Footer,
    ItemList,
    ItemElement,
    ItemForm,
};