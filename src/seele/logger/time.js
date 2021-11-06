module.exports = () => {
    const time = new Date();
    const
        month = time.getMonth() + 1,
        date = time.getDate(),
        hours = time.getHours(),
        minutes = time.getMinutes(),
        seconds = time.getSeconds();
    return `[${month > 9 ? month : `0${month}`}-${date > 9 ? date : `0${date}`}-${hours > 9 ? hours : `0${hours}`}:${minutes > 9 ? minutes : `0${minutes}`}:${seconds > 9 ? seconds : `0${seconds}`}]`
}
