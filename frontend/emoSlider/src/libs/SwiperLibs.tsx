import { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';

// Import Swiper React components【スワイパー自体の読込】
import { Swiper, SwiperSlide } from 'swiper/react';

// import required modules【使いたい機能】
import { EffectCards, Autoplay } from 'swiper/modules';

export default function SwiperLibs() {
    const theAry: string[] = [];
    for (let i = 1; i <= 5; i++) theAry.push(`Slider ${i}`);
    const [slider] = useState<string[]>(theAry);

    const [beforeActivedSliderIndex, setBeforeActivedSliderIndex] = useState<number>(0);
    const touchStart = (el: HTMLElement) => {
        const SwiperSlide: NodeListOf<HTMLDivElement> = el.querySelectorAll('.swiper-slide');
        SwiperSlide.forEach((slider, i) => {
            if (slider.classList.contains('swiper-slide-active')) {
                setBeforeActivedSliderIndex((_prevBeforeActivedSliderIndex) => i);
            }
        });
    }

    const touchEnd = (el: HTMLElement) => {
        const SwiperSlide: NodeListOf<HTMLDivElement> = el.querySelectorAll('.swiper-slide');
        let currActiveSlider = 0;
        SwiperSlide.forEach((slider, i) => {
            if (slider.classList.contains('swiper-slide-active')) {
                currActiveSlider = i;
            }
            if (currActiveSlider < beforeActivedSliderIndex && i === beforeActivedSliderIndex) {
                slider.classList.add('dir-prev');
                console.log(slider.textContent);
            } else if (currActiveSlider > beforeActivedSliderIndex && i === beforeActivedSliderIndex) {
                slider.classList.add('dir-next');
                console.log(slider.textContent);
            }
        });
    }

    useEffect(() => {
        const SwiperSlide: NodeListOf<HTMLDivElement> | null = document.querySelectorAll('.swiper-slide');
        SwiperSlide.forEach((slider, i) => {
            if (i === 0) {
                slider.style.setProperty('animation', 'none');
            }
        });
    }, []);

    return (
        <SwiperWrapper>
            <Swiper
                effect={'cards'}
                grabCursor={true}
                modules={[EffectCards, Autoplay]}
                className="theSwiper"
            // onTouchStart={(e) => touchStart(e.el)}
            // onTouchEnd={(e) => touchEnd(e.el)}
            >
                {slider.length > 0 &&
                    slider.map((elm, i) => (
                        <SwiperSlide key={i}>{elm}</SwiperSlide>
                    ))
                }
            </Swiper>
        </SwiperWrapper>
    );
}

const SwiperWrapper = styled.div`
max-width: 320px;
margin: 5em auto;

& .swiper {
    aspect-ratio: 16/9;
}

& .swiper-wrapper {
    gap: 2.5em;

    & .swiper-slide {
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: .8rem;
        color: #fff;

        &.swiper-slide-active{
            animation: sliderMove 1 .75s ease-in-out;
            position: relative;

            &::before,
            &::after {
                content: "";
                width: 100%;
                height: 16px;
                background-color: #333;
                position: absolute;
                top: 0;
                left: 0;
            }

            &::after {
                top: auto;
                left: auto;
                bottom: 0;
                right: 0;
            }

            & div{
                background-color: transparent;
                opacity: 1!important;

                &::before,
                &::after {
                    content: "";
                    width: 16px;
                    height: 100%;
                    background-color: #333;
                    position: absolute;
                    top: 0;
                    left: 0;
                }

                &::after {
                    top: auto;
                    left: auto;
                    bottom: 0;
                    right: 0;
                }
            }
        }

        &:nth-child(1n) {
            background-color: rgb(206, 17, 17);
        }

        &:nth-child(2n) {
            background-color: rgb(0, 140, 255);
        }

        &:nth-child(3n) {
            background-color: rgb(10, 184, 111);
        }

        &:nth-child(4n) {
            background-color: rgb(211, 122, 7);
        }

        &:nth-child(5n) {
            background-color: rgb(118, 163, 12);
        }

        &:nth-child(6n) {
            background-color: rgb(180, 10, 47);
        }

        &:nth-child(7n) {
            background-color: rgb(35, 99, 19);
        }

        &:nth-child(8n) {
            background-color: rgb(0, 68, 255);
        }

        &:nth-child(9n) {
            background-color: rgb(218, 12, 218);
        }

        &:nth-child(10n) {
            background-color: rgb(54, 94, 77);
        }
    }
}

@keyframes sliderMove {
    0%{
        filter: blur(8px);
        opacity: 0;
    }
    
    100%{
        filter:blur(0);
        opacity: 1;
    }
}

@media screen and (min-width: 1025px) {
    & .swiper-wrapper {
        
        & .swiper-slide {
            border-radius: 8px;
        }
    }
}
`;