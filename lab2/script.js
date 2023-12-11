InitiateSliders();

function InitiateSliders() {
    const sliders = document.querySelectorAll(".slider");

    for (let i = 0; i < sliders.length; i++) {
        const slider = sliders[i];
        const slides = slider.querySelector(".slides").children;
        let currentSlide = 0;
        let paused = false;

        const controls = document.createElement("div");
        controls.classList.add("slider-controls");
        slider.append(controls);

        const prevBtn = document.createElement("button");
        prevBtn.innerText = "Previous";
        prevBtn.addEventListener("click", () => ChangeSlide(currentSlide-1));
        controls.append(prevBtn);

        const nextBtn = document.createElement("button");
        nextBtn.innerText = "Next";
        nextBtn.addEventListener("click", () => ChangeSlide(currentSlide+1));
        controls.append(nextBtn);

        for (let j = 0; j < slides.length; j++) {
            const slide = slides[j];
            slide.classList.add("slide");
            slide.addEventListener("mouseover", () => { paused = true; });
            slide.addEventListener("mouseout", () => { paused = false; });
            const radioSelector = document.createElement("input");
            radioSelector.setAttribute("type", "radio");
            radioSelector.setAttribute("name", `slider${i}`);
            if(j == 0) radioSelector.checked = true;
            radioSelector.addEventListener("click", () => ChangeSlide(j));
            controls.append(radioSelector);
        }

        setInterval((e) => {
            if(!paused) ChangeSlide(currentSlide+1);
        }, 3000);

        function ChangeSlide(id) {
            let margin = 0;
            if (id >= slides.length) id = 0; 
            if (id < 0) id = slides.length-1;
            currentSlide = id;

            for (let i = 0; i < slides.length; i++) {
                const slide = slides[i];
                if (currentSlide != i && slide.classList.contains("active")) slide.classList.remove("active");
                if (currentSlide == i && !slide.classList.contains("active")) slide.classList.add("active");
                if (i < currentSlide) margin -= slide.width;
            }

            const radios = controls.querySelectorAll("input");
            for (let i = 0; i < radios.length; i++) {
                const radio = radios[i];
                if (currentSlide == i) radio.checked = true;
            }

            slides[0].style.marginLeft = `${margin}px`;
        }
    }
}