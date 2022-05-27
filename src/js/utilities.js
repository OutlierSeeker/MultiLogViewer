exports.delay = time => new Promise(res => setTimeout(res, time));

/* https://stackoverflow.com/a/57401891/547768 */
function adjust(color, amount) {
    return '#' + color.replace(/^#/, '').replace(/../g, color =>
        ('0' + Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)).substr(-2));
}