(function () {
    function init(paths) {
        for (let i = 0; i < paths.length; i++) {
            let path = paths[i];
            let pathLength = path.getTotalLength();
            path.style.strokeDasharray = pathLength;
            path.style.strokeDashoffset = pathLength;
        }
    }

    function draw(paths) {
        for (let i = 0; i < paths.length; i++) {
            let path = paths[i];
            path.style.transition = `all 2s linear ${(i*0.1).toFixed(1)}s`;
            setTimeout(function () {
                path.style.strokeDashoffset = '0';
            }, 0);
        }
    }

    function start() {
        let SVGs = document.querySelectorAll('.draw-svg');
        console.log(SVGs.length);

        for (let i = 0; i < SVGs.length; i++) {
            console.log('add load event', i);
            let SVG = SVGs[i];
            SVG.addEventListener('load', function () {
                console.log('draw', i);
                let SVGDocument = SVG.contentDocument;
                let paths = SVGDocument.querySelectorAll('path, line, polygon');
                init(paths);
                draw(paths);
            });
        }
    }

    document.addEventListener('DOMContentLoaded', start);
    //start();
})();