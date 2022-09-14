const kfAttackTimeToFullDate = (dateTimeAttack) => {
    let date, time, year, month, day, hours, minutes, seconds;
    if (dateTimeAttack.includes("on")) {
        dateTimeAttack = dateTimeAttack.replace(new RegExp('on ', 'g'), "");
        dateTimeAttack = dateTimeAttack.replace(new RegExp('at ', 'g'), "");
        [date, time] = dateTimeAttack.split(" ");
        [year, month, day] = date.split("-");
        [hours, minutes, seconds] = time.split(":");
    }
    else
    {
        [date, time] = dateTimeAttack.split(" ");
        [day, month, year] = date.split(".");
        [hours, minutes, seconds] = time.split(":");
    }
    const newDate = new Date(year, month - 1, day, hours, minutes, seconds);
    return newDate;
}

function millisToMinutesAndSeconds(millis) {
    var minutes = Math.floor(millis / 60000);
    var seconds = ((millis % 60000) / 1000).toFixed(0);
    return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
}


module.exports = { kfAttackTimeToFullDate, millisToMinutesAndSeconds };
