import React, { useEffect } from 'react';
import '../css/styles.css';

const HomeContent = () => {

    useEffect(() => {
        let size;
        const homeSwiper = document.getElementById('home__swiper');
        const homeContent = document.querySelectorAll('.home__content');

        // Buttons
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');

        // Counter
        let counter = 1;
        function myFunction(x) {
            size = homeContent[0].clientWidth;
            homeSwiper.style.transition = "transform 0s ease-in-out";
            homeSwiper.style.transform = `translateX(${-size * counter}px)`;
        }

        // Button Listeners
        const handleNext = () => {
            if (counter >= homeContent.length - 1) return;
            counter++;
            homeSwiper.style.transition = "transform 0.5s ease-in-out";
            homeSwiper.style.transform = `translateX(${-size * counter}px)`;
        };

        const handlePrev = () => {
            if (counter <= 0) return;
            counter--;
            homeSwiper.style.transition = "transform 0.5s ease-in-out";
            homeSwiper.style.transform = `translateX(${-size * counter}px)`;
        };

        nextBtn.addEventListener('click', handleNext);
        prevBtn.addEventListener('click', handlePrev);

        homeSwiper.addEventListener('transitionend', () => {
            if (homeContent[counter].id === 'lastClone') {
                homeSwiper.style.transition = "none";
                counter = homeContent.length - 2;
                homeSwiper.style.transform = `translateX(${-size * counter}px)`;
            }
            if (homeContent[counter].id === 'firstClone') {
                homeSwiper.style.transition = "none";
                counter = homeContent.length - counter;
                homeSwiper.style.transform = `translateX(${-size * counter}px)`;
            }
        });

        let maxWidth1300 = window.matchMedia("(max-width: 1300px)");
        let maxWidth1000 = window.matchMedia("(max-width: 1000px)");
        let maxWidth800 = window.matchMedia("(max-width: 800px)");
        let maxWidth595 = window.matchMedia("(max-width: 595px)");
        myFunction(maxWidth1300);
        myFunction(maxWidth1000);
        myFunction(maxWidth800);
        myFunction(maxWidth595);
        maxWidth1300.addListener(myFunction);
        maxWidth1000.addListener(myFunction);
        maxWidth800.addListener(myFunction);
        maxWidth595.addListener(myFunction);

        return () => {
            nextBtn.removeEventListener('click', handleNext);
            prevBtn.removeEventListener('click', handlePrev);
            maxWidth1300.removeListener(myFunction);
            maxWidth1000.removeListener(myFunction);
            maxWidth800.removeListener(myFunction);
            maxWidth595.removeListener(myFunction);
        };
    }, []);

    return (
        <div className="home">
            <div className="home__container">
                <div id="home__swiper">
                    <div className="home__content home__4" id="lastClone">
                        <div className="home__wallpaper home--4"></div>
                        <div className="home__desc">
                            <div className="home__logo">
                                <h1>scatter brained</h1>
                            </div>
                            <p className="home__p">
                                "Scatter-Brained" is a thought-provoking and visually stunning work
                                that invites the viewer to consider the ways in which our thoughts and experiences intersect and overlap.
                                And with that, viewer to reflect on the complex nature of the human mind and the ways in
                                which our different thoughts, emotions, and experiences are all tied together.
                                <br /><br /><a target="_blank" href="https://linktr.ee/madworldink">Discover more</a>
                            </p>
                        </div>
                    </div>
                    <div className="home__content home__1">
                        <div className="home__wallpaper home--1"></div>
                        <div className="home__desc">
                            <div className="home__logo">
                                <h1>void</h1>
                            </div>
                            <p className="home__p">
                                "Void" is a stunning and thought-provoking painting that depicts a woman in a state of melting, amidst a swirl of vibrant and intense colors.
                                The painting captures the subject in a state of flux, as if she is dissolving into the void, and conveys a sense of emptiness and loss.
                                <br /><br /><a target="_blank" href="https://linktr.ee/madworldink">Discover more</a>
                            </p>
                        </div>
                    </div>
                    <div className="home__content home__2">
                        <div className="home__wallpaper home--2"></div>
                        <div className="home__desc">
                            <div className="home__logo">
                                <h1>dying to live</h1>
                            </div>
                            <p className="home__p">
                                "Dying to Live" is a vivid and emotive painting that captures the essence of resilience and hope.
                                The canvas is awash with rich and dynamic hues that come together to create a powerful visual representation of the struggle for survival.
                                <br /><br /><a target="_blank" href="https://linktr.ee/madworldink">Discover more</a>
                            </p>
                        </div>
                    </div>
                    <div className="home__content home__3">
                        <div className="home__wallpaper home--3"></div>
                        <div className="home__desc">
                            <div className="home__logo">
                                <h1>shared consciousness</h1>
                            </div>
                            <p className="home__p">
                                "Shared Consciousness" is a striking and thought-provoking painting that explores the concept of the duality of human consciousness.
                                The eye in the center serves as a reminder of the unifying force that connects us all, and symbolizes the idea that we are all connected by a shared consciousness.
                                <br /><br /><a target="_blank" href="https://linktr.ee/madworldink">Discover more</a>
                            </p>
                        </div>
                    </div>
                    <div className="home__content home__4">
                        <div className="home__wallpaper home--4"></div>
                        <div className="home__desc">
                            <div className="home__logo">
                                <h1>scatter brained</h1>
                            </div>
                            <p className="home__p">
                                "Scatter-Brained" is a thought-provoking and visually stunning work
                                that invites the viewer to consider the ways in which our thoughts and experiences intersect and overlap.
                                And with that, viewer to reflect on the complex nature of the human mind and the ways in
                                which our different thoughts, emotions, and experiences are all tied together.
                                <br /><br /><a target="_blank" href="https://linktr.ee/madworldink">Discover more</a>
                            </p>
                        </div>
                    </div>
                    <div className="home__content home__1" id="firstClone">
                        <div className="home__wallpaper home--1"></div>
                        <div className="home__desc">
                            <div className="home__logo">
                                <h1>void</h1>
                            </div>
                            <p className="home__p">
                                "Void" is a stunning and thought-provoking painting that depicts a woman in a state of melting, amidst a swirl of vibrant and intense colors.
                                The painting captures the subject in a state of flux, as if she is dissolving into the void, and conveys a sense of emptiness and loss.
                                <br /><br /><a target="_blank" href="https://linktr.ee/madworldink">Discover more</a>
                            </p>
                        </div>
                    </div>
                </div>
                <i className='bx bx-chevron-left' id="prevBtn"></i>
                <i className='bx bx-chevron-right' id="nextBtn"></i>
            </div>
        </div>
    );
}

export default HomeContent;