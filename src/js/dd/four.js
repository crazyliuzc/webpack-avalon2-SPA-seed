var msHtmlA = avalon.define({
    $id: 'msHtmlA',
    init: function () {
        avalon.log("four init"+_.now());
    },
    getMsHtmlAFun: function () {
        avalon.log('MsHtmlA|'+new Date());
    }
});
module.exports = msHtmlA;