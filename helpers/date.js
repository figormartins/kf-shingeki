//on 2022-09-12 at 23:10:08

const kfAttackTimeToFullDate = (dateTimeAttack) => {
    dateTimeAttack = dateTimeAttack.replace(new RegExp('on ', 'g'), "");
    dateTimeAttack = dateTimeAttack.replace(new RegExp('at ', 'g'), "");
    const [date, time] = dateTimeAttack.split(" ");
    const [year, month, day] = date.split("-");
    const [hours, minutes, seconds] = time.split(":");
    const newDate = new Date(year, month - 1, day, hours, minutes, seconds);
    return newDate;
}

function millisToMinutesAndSeconds(millis) {
    var minutes = Math.floor(millis / 60000);
    var seconds = ((millis % 60000) / 1000).toFixed(0);
    return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
}


module.exports = { kfAttackTimeToFullDate, millisToMinutesAndSeconds };
