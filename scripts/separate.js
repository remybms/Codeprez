import { readFile, access, writeFile, rm, mkdir, constants } from 'node:fs/promises'
import { basename, extname, join } from 'node:path'

export const separate = async (folder) => {
    try {
        await access(`./public/presentation.md`, constants.R_OK);
        const content = await readFile(`./public/presentation.md`, {encoding : "utf-8"});
        const slides = content.split("---")
        await writeSlides(slides, `presentation.md`, `./public/slides`)
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