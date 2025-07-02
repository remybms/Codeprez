export function convertCode(hljs) {
    document.querySelectorAll('a').forEach(async (link) => {
        console.log(link.href)
        if (link.href.includes('.js')) {
            console.log("convert")
            const res = await fetch(link.href);
            const code = await res.text();
            const pre = document.createElement('pre');
            const codeBlock = document.createElement('code');
            codeBlock.textContent = code;
            pre.appendChild(codeBlock);
            link.replaceWith(pre);
            hljs.highlightAll()
        }
    });
}