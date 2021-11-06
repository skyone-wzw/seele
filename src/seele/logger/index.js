module.exports = {
    log: require('./log').bind(this),
    error: require('./error').bind(this)
}
