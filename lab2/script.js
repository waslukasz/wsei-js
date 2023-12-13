InitiateSliders();

function InitiateSliders() {
    const sliders = document.querySelectorAll(".slider");

    for (let i = 0; i < sliders.length; i++) {
        const slider = sliders[i];
        const slides = slider.querySelector(".slides").children;
        let currentSlide = 0;
        let altAnimation = false; // Alternative animation. false: carousel, true: fade in

        const INTERVAL_TIME_MS = 3000; // Time between changins slides automatically.
        let timer = null; // Interval that changes slides automatically.
        const interval = new AutoSlideChange();
        interval.start();
        function AutoSlideChange() { // Function to make automatic slide change code more clear.
            AutoSlideChange.prototype.start = function() {if(timer == null) timer = setInterval(() => ChangeSlide(currentSlide+1), INTERVAL_TIME_MS);}
            AutoSlideChange.prototype.stop = function() {clearInterval(timer); timer = null;}
        }

        const controls = document.createElement("div");
        controls.classList.add("slider-controls");
        slider.append(controls);
        const prevBtn = document.createElement("button");
        prevBtn.innerText = "Previous";
        prevBtn.addEventListener("click", () => ChangeSlide(currentSlide-1));
        controls.append(prevBtn);
        prevBtn.addEventListener("mouseover", () => interval.stop());
        prevBtn.addEventListener("mouseleave", () => interval.start());

        const nextBtn = document.createElement("button");
        nextBtn.innerText = "Next";
        nextBtn.addEventListener("click", () => ChangeSlide(currentSlide+1));
        controls.append(nextBtn);
        nextBtn.addEventListener("mouseover", () => interval.stop());
        nextBtn.addEventListener("mouseleave", () => interval.start());

        const altAnimToggle = document.createElement("label");
        altAnimToggle.setAttribute("for", `altAnim${i}`);
        const altAnimToggleCheckbox = document.createElement("input");
        altAnimToggleCheckbox.setAttribute("id", `altAnim${i}`);
        altAnimToggleCheckbox.setAttribute("type", "checkbox");
        altAnimToggleCheckbox.setAttribute("name", `altAnim${i}`);
        altAnimToggle.innerText = "Alternative animation";
        altAnimToggle.style.margin = "0 25px";
        altAnimToggle.append(altAnimToggleCheckbox);
        controls.append(altAnimToggle);

        for (let j = 0; j < slides.length; j++) {
            const slide = slides[j];
            slide.classList.add("slide");
            slide.addEventListener("mouseover", () => {interval.stop()});
            slide.addEventListener("mouseout", () => {interval.start()});
            slide.addEventListener("click", (event) => { Lightbox(event.target) });
            const radioSelector = document.createElement("input");
            radioSelector.setAttribute("type", "radio");
            radioSelector.setAttribute("name", `slider${i}`);
            if(j == 0) radioSelector.checked = true;
            radioSelector.addEventListener("mouseover", () => interval.stop());
            radioSelector.addEventListener("mouseleave", () => interval.start());
            radioSelector.addEventListener("click", () => ChangeSlide(j));
            controls.append(radioSelector);
        }

        const lightbox = document.createElement("div");
        lightbox.classList.add("lightbox");
        document.body.append(lightbox);

        function Lightbox(slide) {
            lightbox.classList.add("active");
            const content = slide.cloneNode(true);
            interval.stop()
            lightbox.append(content);
            lightbox.addEventListener("click", () => {
                lightbox.classList.remove("active");
                interval.start();
                lightbox.innerHTML = "";
            });
            lightbox.addEventListener("mouseover", () => interval.stop());
        }

        function ChangeSlide(id) {
            altAnimation = altAnimToggleCheckbox.checked;
            let margin = 0;
            if (id >= slides.length) id = 0;
            if (id < 0) id = slides.length-1;
            currentSlide = id;

            for (let i = 0; i < slides.length; i++) {
                const slide = slides[i];
                if (!altAnimation && slide.classList.contains("slide-alt")) slide.classList.remove("slide-alt");    // Add class to change animation style depending on settings.
                else if (altAnimation && !slide.classList.contains("slide-alt")) slide.classList.add("slide-alt");
                if (currentSlide != i && slide.classList.contains("active")) slide.classList.remove("active");      // Add class to style active slide.
                else if (currentSlide == i && !slide.classList.contains("active")) slide.classList.add("active");
                if (i < currentSlide) margin -= slide.width;    // Calculate margin needed to show current slide.
            }

            const radios = controls.querySelectorAll(`input[type="radio"]`); // Select correct radio element to show which slide is shown at the moment.
            for (let i = 0; i < radios.length; i++) {
                const radio = radios[i];
                if (currentSlide == i) radio.checked = true;
            }

            slides[0].style.marginLeft = `${margin}px`; // Move (by previous slides width in px) first slide to show other.
        }
    }
}