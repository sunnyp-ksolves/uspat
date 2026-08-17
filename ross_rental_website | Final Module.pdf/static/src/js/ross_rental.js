/** Ross Rental Cars — frontend interactions (ported from the mockup script).
 * Real multi-page navigation now handles routing, so this only keeps the
 * on-page behaviours: sticky header, scroll reveal, booking tabs, rate
 * toggle, home category chips, testimonial carousel and fleet filters.
 */
(function () {
    "use strict";

    function onReady(fn) {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", fn);
        } else {
            fn();
        }
    }

    onReady(function () {
        /* ---- sticky header shadow ---- */
        var hd = document.querySelector("header#top.hd");
        if (hd) {
            addEventListener("scroll", function () {
                hd.classList.toggle("scrolled", window.scrollY > 20);
            });
        }

        /* ---- reveal on scroll ---- */
        var revealEls = document.querySelectorAll(".reveal");
        if (revealEls.length && "IntersectionObserver" in window) {
            var io = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("in");
                        io.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.12 });
            revealEls.forEach(function (el) { io.observe(el); });
        } else {
            revealEls.forEach(function (el) { el.classList.add("in"); });
        }

        /* ---- booking tabs ---- */
        var bookingTabs = document.querySelectorAll(".booking .tab");
        bookingTabs.forEach(function (tab) {
            tab.addEventListener("click", function () {
                bookingTabs.forEach(function (t) { t.classList.remove("on"); });
                tab.classList.add("on");
            });
        });

        /* ---- rate toggle (day / week / month) ---- */
        var rateButtons = document.querySelectorAll("#rateToggle button");
        rateButtons.forEach(function (btn) {
            btn.addEventListener("click", function () {
                rateButtons.forEach(function (b) { b.classList.remove("on"); });
                btn.classList.add("on");
                var period = btn.dataset.p;
                document.querySelectorAll(".pval").forEach(function (el) {
                    el.textContent = el.dataset[period];
                });
                document.querySelectorAll(".punit").forEach(function (el) {
                    el.textContent = period === "day" ? " /day" : period === "week" ? " /week" : " /month";
                });
                document.querySelectorAll(".psave").forEach(function (el) {
                    el.textContent = el.dataset[period] || "";
                });
            });
        });

        /* ---- home fleet category chips ---- */
        var homeChips = document.querySelectorAll("#homeChips .chip-f");
        if (homeChips.length) {
            homeChips.forEach(function (chip) {
                chip.addEventListener("click", function () {
                    homeChips.forEach(function (c) { c.classList.remove("on"); });
                    chip.classList.add("on");
                    var value = chip.textContent.trim();
                    document.querySelectorAll("#homeCars .car-card").forEach(function (card) {
                        var cat = card.dataset.cat;
                        var match = value === "All" || (value.indexOf("SUV") > -1 ? cat === "SUV" : cat === value);
                        card.classList.toggle("hidden", !match);
                    });
                });
            });
        }

        /* ---- testimonial carousel ---- */
        var track = document.getElementById("track");
        var dotsBox = document.getElementById("dots");
        if (track && dotsBox) {
            var total = track.children.length;
            var per = function () { return window.innerWidth >= 760 ? 3 : 1; };
            var idx = 0;
            var pages = function () { return Math.max(1, total - per() + 1); };
            var renderDots = function () {
                dotsBox.innerHTML = "";
                for (var i = 0; i < pages(); i++) {
                    var d = document.createElement("button");
                    if (i === idx) d.className = "on";
                    d.type = "button";
                    (function (page) { d.addEventListener("click", function () { idx = page; update(); }); })(i);
                    dotsBox.appendChild(d);
                }
            };
            var update = function () {
                var w = track.children[0].getBoundingClientRect().width;
                track.style.transform = "translateX(" + (-idx * w) + "px)";
                Array.prototype.forEach.call(dotsBox.children, function (d, i) {
                    d.classList.toggle("on", i === idx);
                });
            };
            renderDots();
            update();
            var timer = setInterval(function () {
                idx = (idx + 1) % pages();
                update();
                renderDots();
            }, 5000);
            addEventListener("resize", function () {
                idx = 0;
                renderDots();
                update();
            });
            document.addEventListener("visibilitychange", function () {
                if (document.hidden) clearInterval(timer);
            });
        }

        /* ---- fleet page filters ---- */
        var fleetGrid = document.getElementById("fleetGrid");
        if (fleetGrid) {
            var applyFleetFilters = function () {
                var cats = Array.prototype.map.call(document.querySelectorAll(".fcat:checked"), function (x) { return x.value; });
                var trans = Array.prototype.map.call(document.querySelectorAll(".ftrans:checked"), function (x) { return x.value; });
                var max = +document.querySelector(".filters .range").value;
                var shown = 0;
                fleetGrid.querySelectorAll(".car-card").forEach(function (card) {
                    var okCat = !cats.length || cats.indexOf(card.dataset.cat) > -1;
                    var okTrans = !trans.length || trans.indexOf(card.dataset.trans) > -1;
                    var okPrice = +card.dataset.price <= max;
                    var ok = okCat && okTrans && okPrice;
                    card.classList.toggle("hidden", !ok);
                    if (ok) shown++;
                });
                var count = document.getElementById("fcount");
                if (count) count.textContent = shown;
            };
            document.querySelectorAll(".fcat, .ftrans").forEach(function (el) {
                el.addEventListener("change", applyFleetFilters);
            });
            var range = document.querySelector(".filters .range");
            if (range) range.addEventListener("input", applyFleetFilters);
            var resetBtn = document.querySelector(".js_reset_filters");
            if (resetBtn) {
                resetBtn.addEventListener("click", function () {
                    document.querySelectorAll(".fcat, .ftrans").forEach(function (x) { x.checked = false; });
                    if (range) range.value = 120;
                    applyFleetFilters();
                });
            }
        }
    });
})();
