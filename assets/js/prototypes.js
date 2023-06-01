export default () => {

    Array.prototype.isEmpty = function () {
        return this.length === 0;
    }

    Array.prototype.noneMatch = function (call) {
        return this.filter(call).length === 0;
    }

}
