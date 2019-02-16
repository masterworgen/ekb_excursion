(function() {
    let comments = document.querySelector("comments");

    let form = document.querySelector("form");
    let formFields = form.querySelectorAll("input,textarea");
    let sendButton = form.querySelector(".send-feedback");

    sendButton.addEventListener("click", function () {
        let formData = new FormData();

        for (let i = 0; i < formFields.length; i++) {
            let field = formFields[i];
            formData.append(field.name, field.value);
        }

        fetch("/feedback/?content=true", {
            method: "POST",
            body: formData
        }).then(function (response) {
            console.log(response.status);
            return response.text();
        }).then(function (body) {
            openPage("/feedback", false);
        }).catch(function () {
            // что-то не так!
        })
    });
})();