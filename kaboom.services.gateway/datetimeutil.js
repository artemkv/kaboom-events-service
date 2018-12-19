"use strict";

function getYear(date) {
    return date.getFullYear();
}

function getMonth(date) {
    let month = date.getMonth() + 1;
    if (month < 10) {
        month = '0' + month.toString();
    } else {
        month = month.toString();
    }
    return month;
}

function getDay(date) {
    let day = date.getDate();
    if (day < 10) {
        day = '0' + day.toString();
    } else {
        day = day.toString();
    }
    return day;
}

const getSortableDate = function () {
    let now = new Date();
    return getYear(now) + getMonth(now) + getDay(now);
}

const getTimeStamp = function () {
    function pad(val) {
        if (val < 10) {
            return '0' + val.toString();
        } else {
            return val.toString();
        }
    }
    let now = new Date();
    let hours = pad(now.getHours());
    let minutes = pad(now.getMinutes());
    let seconds = pad(now.getSeconds());
    return `${hours}:${minutes}:${seconds}`;
}

exports.getSortableDate = getSortableDate;
exports.getTimeStamp = getTimeStamp;