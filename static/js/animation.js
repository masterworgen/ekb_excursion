/**
 * @callback AnimationDrawCallback
 * @param {number} passedTime Время, прошедшее со старта анимации в миллисекундах
 * @param {number} duration Длительность анимации в миллисекундах
 */

/**
 * Анимация
 * @param {Object} params Параметры анимации
 * @param {AnimationDrawCallback} params.draw Функция, рисующая анимацию
 * @param {Function} [params.onStart] Вызывается при старте анимации
 * @param {Function} [params.onCancel] Вызывается при отмене анимации
 * @param {Function} [params.onEnd] Вызвается при окончании анимации
 * @param {number} [params.duration=1000] Длительность анимации в миллисекундах
 * @constructor
 */
function Animation(params) {
    "use strict";
    if (params === undefined) {
        throw new Error("Missing required parameter");
    }

    const draw = params.draw;
    const onStart = params.onStart;
    const onCancel = params.onCancel;
    const onEnd = params.onEnd;
    const duration = params.duration || 1000;

    if (draw === undefined) {
        throw new Error("draw is undefined");
    }

    let playing = false;
    let canceled = false;

    /**
     * Запуск анимации
     */
    this.start = function () {
        playing = true;
        if (onStart !== undefined) {
            onStart();
        }

        const startTime = performance.now();
        let passed = 0;
        requestAnimationFrame(function a(time) {
            if (canceled) {
                return;
            }

            passed = time - startTime;
            if (passed > duration) {
                passed = duration;
            }

            draw(passed, duration);

            if (passed < duration) {
                requestAnimationFrame(a);
            } else if (onEnd !== undefined) {
                playing = false;
                onEnd();
            } else {
                playing = false;
            }
        });
    };

    /**
     * Отмена анимации
     */
    this.cancel = function () {
        if (playing) {
            canceled = true;
            if (onCancel !== undefined) {
                onCancel();
            }
        }
    };
}