import { spawn } from 'node:child_process'

const main = () => {
    const next = spawn("npm", ["run", "dev"], {shell: true})
    next.stdout.on("data", (data) => {
        if(data.includes("Ready in")){
            const electron = spawn("npm", ["run", "electron:start"], {shell : true})
        }
    })
}

main()