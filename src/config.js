module.exports.mirai = {
    url: process.env["url"],
    verifyKey: process.env["verifyKey"],
    qq: process.env["qq"]
}

module.exports.group = {
    pro: [
        ...(process.env['group'] || '').split("*").map(_ => parseInt(_)),
    ],
}

module.exports.user = {
    admin: [
        ...(process.env['admin'] || '').split("*").map(_ => parseInt(_)),
    ],
}
