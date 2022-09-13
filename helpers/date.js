//12.09.2022 23:10:08
const kfAttackTimeToFullDate = (dateTimeAttack) => {
    const [date, time] = dateTimeAttack.split(" ");
    const [day, month, year] = date.split(".");
    const [hours, minutes, seconds] = time.split(":");
    const newDate = new Date(year, month - 1, day, hours, minutes, seconds);
    console.log(newDate);
    return newDate;
}

function millisToMinutesAndSeconds(millis) {
    var minutes = Math.floor(millis / 60000);
    var seconds = ((millis % 60000) / 1000).toFixed(0);
    return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
}


module.exports = { kfAttackTimeToFullDate, millisToMinutesAndSeconds };