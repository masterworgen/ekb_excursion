(function() {
    let feedback = document.querySelector(".feedback");

    let form = feedback.querySelector("form");
    let formFields = form.querySelectorAll("input,textarea");
    let sendButton = form.querySelector(".send-feedback");
    let comments = feedback.querySelector(".feedback__comments");

    sendButton.addEventListener("click", function () {
        let formData = new FormData();

        for (let i = 0; i < formFields.length; i++) {
            let field = formFields[i];
            formData.append(field.name, field.value);
        }

        let message;

        fetch("/feedback/", {
            method: "POST",
            body: formData
        }).then(function (response) {
            console.log(response.status);
            return response.text();
        }).then(function (body) {

            if (body === "need_verification") {
                message = new Message({
                    type: Message.TYPE_INFO,
                    title: "Отправлено",
                    text: "Ваш отзыв появится после проверки модератором",
                    classList: "feedback__message",
                    duration: 10000
                });
                message.insertAfter(form).show();
            } else if (body === "ok") {

            } else {
                message = new Message({
                    type: Message.TYPE_ERROR,
                    title: "Ошибка",
                    text: ["Что-то пошло не так", "Пожалуйста, попробуйте позже"],
                    classList: "feedback__message",
                    duration: 10000
                });
                message.insertAfter(form).show();
            }
        }).catch(function () {
            message = new Message({
                type: Message.TYPE_ERROR,
                title: "Ошибка",
                text: ["Что-то пошло не так", "Пожалуйста, попробуйте позже"],
                classList: "feedback__message",
                duration: 10000
            });
            message.insertAfter(form).show();
        })
    });
})();