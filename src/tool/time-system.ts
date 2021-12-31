class TimeSystem {
    private _timeOfOneDay: number
    private _timeOfOneWeek: number
    constructor(options?: { timeOfOneDay?: number, timeOfOneWeek?: number }) {

        this._timeOfOneDay = options?.timeOfOneDay || 86400000
        this._timeOfOneWeek = options?.timeOfOneWeek || 86400000 * 7
    }

    getNowInMs() {
        const now_in_ms = +new Date()
        return now_in_ms
    }

    getNowInSec() {
        const now_in_sec = ~~(+new Date()/1000)
        return now_in_sec
    }


    getStartToDayInMs() {
        const now = +new Date()
        const totalDayNumber = ~~(now / this._timeOfOneDay)
        const startDay = totalDayNumber * this._timeOfOneDay
        const endDay = (totalDayNumber + 1) * this._timeOfOneDay - 1
        return startDay
    }
}

export const timeSystem = new TimeSystem()