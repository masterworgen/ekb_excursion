/**
 * Создает объект сообщения
 * @param {string} type Тип сообщения
 * @param {string} title Заголовок сообщения
 * @param {string|string[]} text Текст сообщения. Если передается массив строк, каждая строка будет отдельным элементом
 * @param {string|string[]} [classList] Классы, которые нужно добавить к элементу сообщения
 * @param {number} [duration] Время отбражения сообщения в мс. Если не укахывать, сообщение не будет скрыто
 * @constructor
 */
function Message({type, title, text, classList, duration}) {
    let messageElement = document.createElement("div");
    let messageClassList = messageElement.classList;

    messageClassList.add("message");

    if (typeof type === "string") {
        messageClassList.add("message_type_" + type);
    } else {
        throw TypeError("Переменная type должна быть строкой");
    }

    if (classList !== undefined) {
        if (typeof classList === "string") {
            messageClassList.add(classList);
        } else if (Array.isArray(classList)) {
            for (let i = 0; i < classList.length; i++) {
                if (typeof classList[i] !== "string") {
                    throw TypeError("Переменная classList должна быть строкой или массивом строк");
                }

                messageClassList.add(classList[i]);
            }
        } else {
            throw TypeError("Переменная classList должна быть строкой или массивом строк");
        }
    }

    let titleSpan = document.createElement("span");
    titleSpan.classList.add("message__title");
    titleSpan.textContent = title;
    messageElement.append(titleSpan);

    let textIsArray = Array.isArray(text);
    if (typeof text !== "string" && !textIsArray) {
        throw TypeError("Переменная text должна быть строкой или массивом строк");
    }

    if (!textIsArray) {
        text = [text];
    }

    for (let i = 0; i < text.length; i++) {
        if (typeof text[i] !== "string") {
            throw TypeError("Переменная text должна быть строкой или массивом строк");
        }

        let textSpan = document.createElement("span");
        textSpan.classList.add("message__text");
        textSpan.textContent = text[i];
        messageElement.append(textSpan);
    }

    function getHeight() {
        let height = 0;

        messageElement.style.position = "absolute";
        messageElement.style.display = "block";
        messageElement.style.visibility = "hidden";


        if (messageElement.parentElement === null) {
            let body = document.querySelector("body");
            body.append(messageElement);

            height = messageElement.clientHeight;
            height += parseInt(getComputedStyle(messageElement).paddingTop);
            height += parseInt(getComputedStyle(messageElement).paddingBottom);

            messageElement.remove();
        } else {
            height = messageElement.clientHeight;
            height += parseInt(getComputedStyle(messageElement).paddingTop);
            height += parseInt(getComputedStyle(messageElement).paddingBottom);
        }

        messageElement.style.position = null;
        messageElement.style.display = null;
        messageElement.style.visibility = null;

        return height;
    }

    this.element = messageElement;
    this.height = getHeight();
    this.duration = duration || 0;

    // Скрыть сообщение
    messageClassList.add("message_hidden");
    messageElement.style.maxHeight = 0 + "px";
}

Message.TYPE_INFO = "info";
Message.TYPE_ERROR = "error";

/**
 * Вставляет элемент на страницу перед элементом node
 * @param {string|ParentNode} node элемент, в который нужно вставить сообщение или селектор
 */
Message.prototype.insertBefore = function (node) {
    if (typeof node === "string") {
        node = document.querySelector(node);
    }

    let parent = node.parentElement;
    parent.insertBefore(this.element, node);
    return this;
};

/**
 * Вставляет элемент на страницу после элемента node
 * @param {string|ParentNode} node элемент, в который нужно вставить сообщение или селектор
 */
Message.prototype.insertAfter = function (node) {
    if (typeof node === "string") {
        node = document.querySelector(node);
    }

    let parent = node.parentElement;
    let next = node.nextSibling;

    if (next) {
        parent.insertBefore(this.element, next);
    } else {
        parent.appendChild(this.element);
    }
    return this;
};

/**
 * Вставляет элемент на страницу в конец элемента node
 * @param {string|ParentNode} node элемент, в который нужно вставить сообщение или селектор
 */
Message.prototype.appendTo = function (node) {
    if (typeof node === "string") {
        node = document.querySelector(node);
    }

    node.append(this.element);
    return this;
};

/**
 * Удаляет сообщение со страницы
 */
Message.prototype.remove = function () {
    this.element.remove();
    return this;
};

/**
 * Отображает сообщение
 */
Message.prototype.show = function() {
    let message = this;

    requestAnimationFrame(function () {
        message.element.style.maxHeight = message.height + "px";
        message.element.classList.remove("message_hidden");

        if (message.duration !== 0) {
            setTimeout(function () {
                message.hide();
            }, message.duration);
        }
    });

    return this;
};

/**
 * Скрывает сообщение
 */
Message.prototype.hide = function() {
    let message = this;

    requestAnimationFrame(function () {
        message.element.style.maxHeight = 0 + "px";
        message.element.classList.add("message_hidden");
    });

    return this;
};
