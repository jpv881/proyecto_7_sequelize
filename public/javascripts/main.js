
$("input[name='password1']").on("keyup", function(){
    validarFormRegistro();
});

$("input[name='password2']").on("keyup", function(){
    validarFormRegistro();
});

function validarFormRegistro(){
    if($("#password1").val() !== $("#password2").val() || $("#password1").val() === "" || $("#password2").val() === ""){
        $("#password1").addClass("inputError");
        $("#password2").addClass("inputError");
        $("#sectionRegistro form button").prop("disabled",true);
    }else {
        if($("#sectionRegistro form button").prop("disabled") === true) $("#sectionRegistro form button").prop("disabled",false);
        if($("#password1").hasClass("inputError")) $("#password1").removeClass("inputError");
        if($("#password2").hasClass("inputError")) $("#password2").removeClass("inputError");
    }
}

