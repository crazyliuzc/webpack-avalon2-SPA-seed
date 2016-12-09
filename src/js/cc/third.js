var vm = avalon.define({
    $id: "loginController",
    user : {
        username : '',
        password : ''
    },
    errorMessage : '',
    successInputName : [],
    errorInputName : [],
    loginValidate : {
        onSuccess : function (reasons){
            if (vm.successInputName.indexOf(this.id) === -1) vm.successInputName.push(this.id.toString());
            if (vm.errorInputName.indexOf(this.id) > -1) vm.errorInputName.splice(vm.errorInputName.indexOf(this.id),1);
        },
        onError: function (reasons) {
            vm.errorMessage = reasons[0].getMessage();

            if (vm.successInputName.indexOf(this.id) > -1) vm.successInputName.splice(vm.successInputName.indexOf(this.id),1);
            if (vm.errorInputName.indexOf(this.id.toString()) === -1) vm.errorInputName.push(this.id.toString());

        }
    }
});

module.exports = vm;