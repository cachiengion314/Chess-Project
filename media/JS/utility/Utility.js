export default class Utility {
    static randomFromAToMax(a = 0, MAX = 2) {
        return Math.floor(Math.random() * (MAX - a)) + a;
    }
    static measureExecutionTime(callbackThatNeedToMeasure) {
        let startTimer = window.performance.now();
        callbackThatNeedToMeasure();
        let endTimer = window.performance.now();
        return endTimer - startTimer;
    }
    static shuffleAnArray(arr) {
        let tempArr = [...arr];
        let rArr = [...arr];
        for (let i = 0; i < arr.length; ++i) {
            let rIndex = Utility.randomFromAToMax(0, tempArr.length);
            rArr[i] = tempArr[rIndex];
            tempArr = tempArr.filter(item => {
                return item != rArr[i];
            });
        }
        return rArr;
    }
    static insertCharAt(originStr, index, replaceStr) {
        return originStr.slice(0, index) + replaceStr + originStr.slice(index + 1);
    }
}