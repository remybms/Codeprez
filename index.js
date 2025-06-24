import { readFile, access, writeFile, rm, mkdir, constants } from 'node:fs/promises'
import { createWriteStream } from 'node:fs'
import { basename, extname, join } from 'node:path'
import archiver from 'archiver';

const separate = async () => {
    const { folder } = getArgs();
    try {
        await access(`./presentations/${folder}/presentation.md`, constants.R_OK);
        const content = await readFile(`./presentations/${folder}/presentation.md`, {encoding : "utf-8"});
        const slides = content.split("---")
        await writeSlides(slides, `${folder}/presentation.md`, `./presentations/${folder}/slides`)
    } catch (e) {
        console.error("Could not access folder " + folder + " : " + e)
    }
}

const writeSlides = async  (slides, file, slidesFolder) => {
    await rm(slidesFolder, {recursive : true, force : true})
    await mkdir(slidesFolder)
    for(let i = 0; i < slides.length; i++){
        await writeFile(join(slidesFolder, `${basename(file, extname(file))}-${i+1}${extname(file)}`), slides[i])
    }
}

const archive = () => {
    const {folder} = getArgs()
    const output = createWriteStream(`./archives/${folder}.codeprez`)
    const archive = archiver('zip', {
        zlib: {level: 9}
    })
    archive.pipe(output)
    archive.directory(`./presentations/${folder}`, false)
    archive.finalize()
}

const getArgs = () => {
    if (process.argv.length < 3) {
        console.error("Usage : npm run start <folder>")
        process.exit()
    }
    return {
        folder: process.argv[2]
    }
}

separate();