export const getArgs = () => {
    if (process.argv.length < 3) {
        console.error("Usage : npm run start <folder>")
        process.exit()
    }
    return {
        folder: process.argv[2]
    }
}