import React, { useEffect } from 'react';
import '../css/styles.css';
import madworldinktop from '../img/madworldinktop.jpg';

const Collection = () => {
    useEffect(() => {
        const collectionSwiper = document.getElementById('collection__swiper');
        const collectionContent = document.querySelectorAll('.collection__content');

        // Buttons
        const collectionPrevBtn = document.getElementById('collectionPrevBtn');
        const collectionNextBtn = document.getElementById('collectionNextBtn');

        // Counter
        let counterCollection = 0;
        const sizeCollection = collectionContent[0].clientWidth + 16 * 2;
        collectionSwiper.style.transform = `translateX(${-sizeCollection * counterCollection}px)`;

        // Button Listeners
        const handleNext = () => {
            if (counterCollection >= collectionContent.length - 1) return;
            counterCollection++;
            collectionSwiper.style.transition = "transform 0.5s ease-in-out";
            collectionSwiper.style.transform = `translateX(${-sizeCollection * counterCollection}px)`;
        };

        const handlePrev = () => {
            if (counterCollection <= 0) return;
            counterCollection--;
            collectionSwiper.style.transition = "transform 0.5s ease-in-out";
            collectionSwiper.style.transform = `translateX(${-sizeCollection * counterCollection}px)`;
        };

        collectionNextBtn.addEventListener('click', handleNext);
        collectionPrevBtn.addEventListener('click', handlePrev);

        return () => {
            collectionNextBtn.removeEventListener('click', handleNext);
            collectionPrevBtn.removeEventListener('click', handlePrev);
        };
    }, []);
    return (
        <div className="collection">
            <div className="collection__img">
                <img src={madworldinktop} alt="" className="collection__image" />
                <div className="collection__img-square"></div>
            </div>
            <div className="collection__container" id="collection__container">
                <div className="collection__swiper" id="collection__swiper">
                    <div className="collection__content" style={{ marginLeft: '2rem' }}>
                        <div className="collection__wallpaper coll__wallpaper-1"></div>
                        <div className="collection__desc">
                            <br /><a href="#latest" className="nav__link">View Details</a>
                        </div>
                    </div>
                    <div className="collection__content">
                        <div className="collection__wallpaper coll__wallpaper-2"></div>
                        <div className="collection__desc">
                            <br /><a href="#homedecor" className="nav__link">View Details</a>
                        </div>
                    </div>
                    <div className="collection__content">
                        <div className="collection__wallpaper coll__wallpaper-3"></div>
                        <div className="collection__desc">
                            <br /><a href="#latest" className="nav__link">View Details</a>
                        </div>
                    </div>
                    <div className="collection__content">
                        <div className="collection__wallpaper coll__wallpaper-4"></div>
                        <div className="collection__desc">
                            <br /><a href="#latest" className="nav__link">View Details</a>
                        </div>
                    </div>
                    <div className="collection__content">
                        <div className="collection__wallpaper coll__wallpaper-5"></div>
                        <div className="collection__desc">
                            <br /><a href="#homedecor" className="nav__link">View Details</a>
                        </div>
                    </div>
                    <div className="collection__content" style={{ marginRight: '2rem' }}>
                        <div className="collection__wallpaper coll__wallpaper-6"></div>
                        <div className="collection__desc">
                            <br /><a href="#latest" className="nav__link">View Details</a>
                        </div>
                    </div>
                </div>
                <i className='bx bx-chevron-left' id="collectionPrevBtn"></i>
                <i className='bx bx-chevron-right' id="collectionNextBtn"></i>
            </div>
        </div>
    );
}

export default Collection;
