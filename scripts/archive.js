import { createWriteStream } from 'node:fs'
import archiver from 'archiver';
import { getArgs } from './getArgs';

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