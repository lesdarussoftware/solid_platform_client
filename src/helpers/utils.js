export function setLocalDate(date) {
    const original = new Date(date)
    let newDate = new Date(original)
    newDate.setHours(newDate.getHours() - 3)
    return newDate
}