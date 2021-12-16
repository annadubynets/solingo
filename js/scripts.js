$(function() {
    var x, i, j, l, ll, selElmnt, a, b, c;
    /*look for any elements with the class "formselectwrap":*/
    x = document.getElementsByClassName("custom-select");
    l = x.length;
    for (i = 0; i < l; i++) {
        selElmnt = x[i].getElementsByTagName("select")[0];
        ll = selElmnt.length;
        /*for each element, create a new DIV that will act as the selected item:*/
        a = document.createElement("DIV");
        a.setAttribute("class", "select-selected");
        a.innerHTML = selElmnt.options[selElmnt.selectedIndex].innerHTML;
        x[i].appendChild(a);
        /*for each element, create a new DIV that will contain the option list:*/
        b = document.createElement("DIV");
        b.setAttribute("class", "select-items select-hide");
        for (j = 1; j < ll; j++) {
            /*for each option in the original select element,
            create a new DIV that will act as an option item:*/
            c = document.createElement("DIV");
            c.innerHTML = selElmnt.options[j].innerHTML;
            c.addEventListener("click", function(e) {
                /*when an item is clicked, update the original select box,
                and the selected item:*/
                var y, i, k, s, h, sl, yl;
                s = this.parentNode.parentNode.getElementsByTagName("select")[0];
                sl = s.length;
                h = this.parentNode.previousSibling;
                for (i = 0; i < sl; i++) {
                    if (s.options[i].innerHTML == this.innerHTML) {
                        s.selectedIndex = i;
                        h.innerHTML = this.innerHTML;
                        y = this.parentNode.getElementsByClassName("same-as-selected");
                        yl = y.length;
                        for (k = 0; k < yl; k++) {
                            y[k].removeAttribute("class");
                        }
                        this.setAttribute("class", "same-as-selected");
                        break;
                    }
                }
                h.click();
            });
            b.appendChild(c);
        }
        x[i].appendChild(b);
        a.addEventListener("click", function(e) {
            /*when the select box is clicked, close any other select boxes,
            and open/close the current select box:*/
            e.stopPropagation();
            closeAllSelect(this);
            this.nextSibling.classList.toggle("select-hide");
            this.classList.toggle("select-arrow-active");
        });
    }

    function closeAllSelect(elmnt) {
        /*a function that will close all select boxes in the document,
        except the current select box:*/
        var x, y, i, xl, yl, arrNo = [];
        x = document.getElementsByClassName("select-items");
        y = document.getElementsByClassName("select-selected");
        xl = x.length;
        yl = y.length;
        for (i = 0; i < yl; i++) {
            if (elmnt == y[i]) {
                arrNo.push(i)
            } else {
                y[i].classList.remove("select-arrow-active");
            }
        }
        for (i = 0; i < xl; i++) {
            if (arrNo.indexOf(i)) {
                x[i].classList.add("select-hide");
            }
        }
    }
    /*if the user clicks anywhere outside the select box,
    then close all select boxes:*/
    document.addEventListener("click", closeAllSelect);

});

if ($('.owl-carousel').length > 0) {
    $('.owl-carousel').owlCarousel({
        loop: true,
        margin: 10,
        responsiveClass: true,
        autoplay: false,
        responsive: {
            0: {
                items: 3,
                stagePadding: 40,
                nav: true
            },
            720: {
                items: 4,
                stagePadding: 40,
                nav: true
            },
            1050: {
                items: 4,
                nav: true
            },
            1200: {
                items: 6,
                nav: true
            }
        }
    })
}

/**
 * Build the progress chart
 * @canvasElem instance of HTML5 canvas
 * @labels array of labels
 * @values array of values
 */
function buildChart(canvasElem, labels, values, goalIndex) {
    const data = {
        labels: labels,
        datasets: [{
            data: values,
            fill: true,
            borderColor: 'rgb(75, 192, 192)',
            backgroundColor: '#80D7EC',
            background: '#5A7591',
            tension: 0.6
        }]
    };

    const config = {
        options: {
            legend: {
                display: false
            },
            scales: {
                y: {
                    display: true,
                    ticks: {
                        display: false,
                    }
                },
                x: {
                    ticks: {
                        color: "#ffffff",
                        // callback: function(val, index) {
                        //     return index == labels.length - 1 ? '' : (index + 1) + '';
                        // },
                    }
                }
            },
            animation: {
                duration: 1,
                onComplete: function() {
                    var chartInstance = this,
                        ctx = this.ctx;
                    ctx.textAlign = 'center';
                    ctx.strokeStyle = '#ffffff';
                    ctx.textBaseline = 'bottom';

                    const meta = this.getDatasetMeta(0);

                    this.data.datasets.forEach(function(dataset) {
                        for (var i = 1; i < dataset.data.length - 1; i++) {
                            var model = meta.data[i];
                            ctx.font = '12px, "Futura"';
                            ctx.fillStyle = '#ffffff';

                            if (i == goalIndex) {
                                const textDimensions = ctx.measureText('GOAL');

                                roundRect(
                                    ctx,
                                    model.x - (textDimensions.width / 2) - 2,
                                    model.y - textDimensions.fontBoundingBoxAscent * 2 - 2,
                                    textDimensions.width + 4,
                                    textDimensions.fontBoundingBoxAscent * 2 + 4, // we have two lines 
                                    10,
                                    '#ffffff'
                                );

                                ctx.fillStyle = '#5A7591';
                                ctx.fillText('GOAL', model.x, model.y - textDimensions.fontBoundingBoxAscent);
                                ctx.fillText(dataset.data[i], model.x, model.y);
                            } else {
                                ctx.fillStyle = '#ffffff';
                                ctx.fillText(dataset.data[i], model.x, model.y - 5);
                            }

                            ctx.beginPath();
                            ctx.strokeStyle = '#ffffff';
                            ctx.lineWidth = 3;
                            ctx.moveTo(model.x, model.y);
                            ctx.lineTo(model.x, chartInstance.scales.y.bottom);
                            ctx.stroke();
                        }
                    });
                }
            },
            plugins: {
                legend: {
                    labels: {
                        generateLabels: function() {
                            return [];
                        }
                    },
                    title: {
                        display: true,
                        color: 'white',
                        text: 'Cognitive score from 0 to 800',
                        padding: 20,
                        font: {
                            name: 'Futura',
                            weight: 600,
                        }
                    }
                }
            }
        },
        type: 'line',
        data: data,
    };
    return new Chart(ctx, config);
}

function roundRect(ctx, x, y, width, height, radius, fill, stroke) {
    if (typeof stroke === 'undefined') {
        stroke = true;
    }
    if (typeof radius === 'undefined') {
        radius = 5;
    }
    if (typeof radius === 'number') {
        radius = { tl: radius, tr: radius, br: radius, bl: radius };
    } else {
        var defaultRadius = { tl: 0, tr: 0, br: 0, bl: 0 };
        for (var side in defaultRadius) {
            radius[side] = radius[side] || defaultRadius[side];
        }
    }
    ctx.beginPath();
    ctx.moveTo(x + radius.tl, y);
    ctx.lineTo(x + width - radius.tr, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
    ctx.lineTo(x + width, y + height - radius.br);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
    ctx.lineTo(x + radius.bl, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
    ctx.lineTo(x, y + radius.tl);
    ctx.quadraticCurveTo(x, y, x + radius.tl, y);
    ctx.closePath();
    if (fill) {
        ctx.fill();
    }
    if (stroke) {
        ctx.stroke();
    }
}

/**
 * File picker
 */

$(function() {
    $('#attachment-file-input').on('change', function(e) {
        $('.attachment-file-name').text(this.files[0].name)
    });

    $('.chose-attachment-file-btn').on('click', function(e) {
        e.preventDefault();
        $("#attachment-file-input").click();
    })
})

/**
 * Tutorial carousel behaviour script. Hides and shows the preb and the next arrows on the carousel
 */
$(function() {
    const carouselSelector = '#tutorialCarousel';
    var carouselEl = $(carouselSelector);
    if (carouselEl.length == 0) return;

    var checkActiveCard = function() {
        if ($(carouselSelector + " .carousel-inner .carousel-item:first").hasClass("active")) {
            carouselEl.children(".carousel-control-prev").hide();
            carouselEl.children(".carousel-control-next").show();
        } else if ($(carouselSelector + " .carousel-inner .carousel-item:last").hasClass("active")) {
            carouselEl.children(".carousel-control-next").hide();
            carouselEl.children(".carousel-control-prev").show();
        } else {
            carouselEl.children(".carousel-control-prev").show();
            carouselEl.children(".carousel-control-next").show();
        }
    };

    checkActiveCard();

    $(carouselSelector).on("slid.bs.carousel", "", checkActiveCard);
})

/*
 DO NOT USER THIS CODE IN THE REAL PROJECT
 It handles ?rtl=true query param for testing rtl.
*/
$(function() {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());
    if (params.rtl == 'true') {
        $('html').attr('lang', 'ar');
        $('html').attr('dir', 'rtl');

        $('link[rel=stylesheet]').each(function() {
            console.log(this);
            this.disabled = true;
        });

        $('head').append('<link rel="stylesheet" href="css/bootstrap.rtl.min.css">');
        $('head').append('<link rel="stylesheet" href="css/style.css"></link>');
    }
});

$(function() {
    var popovers = document.querySelectorAll('.show-simple-popover');
    popovers.forEach(function(elem) {
        new bootstrap.Popover(elem, {
            trigger: 'click',
            template: `<div class="popover simple-popover" role="tooltip"><div class="d-flex justify-content-end"><span class="icon-close"></span></div><div class="popover-body"></div></div>`
        });
    });
})