const {
    bold
} = require('@mengkodingan/ckptw');

module.exports = {
    name: 'fetch',
    category: 'tools',
    code: async (ctx) => {
        const url = ctx._args[0]

        if (!url) return ctx.reply(`${bold('[ ! ]')} Masukkan URL!`)

        try {
            new URL(url)
        } catch {
            return message.reply(`${bold(' [!]')} URL yang Anda berikan tidak valid!`)
        }
        let response
        try {
            response = await fetch(url)
            if (!response.ok) throw `${response.statusText} (${response.status})`
        } catch (error) {
            return ctx.reply(`${bold('[ ! ]')} Terjadi kesalahan: ${error.message}`)
        }
        const headers = response.headers
        const status = response.status
        const data = await response.text()

        // JSON Check
        try {
            const json = JSON.parse(data)
            return message.reply(walkJSON(json))
        } catch {}

        // Image Check
        const img = ['image/png', 'image/jpeg']
        if (img.includes(headers.get('content-type'))) {
            return ctx.reply({
                image: {
                    url: url
                },
                caption: null
            });
        }

        // GIF Check
        if (headers.get('content-type') === 'image/gif') {
            return ctx.reply({
                video: {
                    url: url
                },
                caption: null,
                gifPlayback: true
            });
        }

        // Video Check
        if (headers.get('content-type') === 'video/mp4') {
            return ctx.reply({
                video: {
                    url: url
                },
                caption: null,
                gifPlayback: false
            });
        }

        // PDF
        if (headers.get('content-type') === 'application/pdf' || url.endsWith('.pdf')) {
            const filename = url.split('/').at(-1)
            return ctx.reply({
                document: {
                    url: url
                },
                mimetype: 'application/pdf'
            });
        }

        // File
        if (headers.get('content-type') === 'application/octet-stream') {
            const filename = headers.get('content-disposition')
                .split(';')[1]
                .split('=')[1]
                .slice(1, -1)
            return ctx.reply({
                document: {
                    url: url
                },
                mimetype: 'application/octet-stream'
            });
        }

        // Text
        console.log("Content-Type:", headers.get('content-type'))
        return ctx.reply(
            `Status: ${status}\n` +
            'Response:\n' +
            `${data}`
        );
    }
}

function walkJSON(json, depth, array) {
    const arr = array || []
    const d = depth || 0
    for (const key in json) {
        arr.push('┊'.repeat(d) + (d > 0 ? ' ' : '') + `*${key}:*`)
        if (typeof json[key] === 'object') walkJSON(json[key], d + 1, arr)
        else {
            arr[arr.length - 1] += ' ' + json[key]
        }
    }
    return arr.join('\n')
}