import styled from 'styled-components';
import { useEffect, useState } from 'react';

// Import Swiper React components【スワイパー自体の読込】
import { Swiper, SwiperSlide } from 'swiper/react';

// import required modules【使いたい機能】
import { EffectCards, Autoplay } from 'swiper/modules';

type sliderItems = {
    imgSrc: string;
    imgCap?: string;
}

export default function SwiperLibs() {
    const theAry: sliderItems[] = [];
    // 8枚まで（8枚以上は8枚目が何故か重複してうまく挙動しなくなる）
    for (let i = 1; i < 9; i++) {
        const sliderItem: sliderItems = {
            imgSrc: `https://picsum.photos/id/${Math.floor(Math.random() * 99) + i}/800/450`, // https://picsum.photos/
            imgCap: `Slider ${i}`
        }
        theAry.push(sliderItem);
    }
    const [sliderItem] = useState<sliderItems[]>(theAry);

    useEffect(() => {
        const SwiperSlide: NodeListOf<HTMLDivElement> | null = document.querySelectorAll('.swiper-slide');
        SwiperSlide.forEach((slider, i) => {
            if (i === 0) {
                slider.style.setProperty('animation', 'none');
            }
        });
    }, []);

    return (
        <TheWrapper>
            <SwiperWrapper>
                <Swiper
                    effect={'cards'}
                    grabCursor={true}
                    autoplay={{
                        delay: 2500
                    }}
                    modules={[EffectCards, Autoplay]}
                    className="theSwiper"
                >
                    {sliderItem.length > 0 &&
                        sliderItem.map((slider, i) => (
                            <SwiperSlide key={i}>
                                <figure>
                                    <img src={slider.imgSrc} alt="imges" />
                                    {slider.imgCap &&
                                        <figcaption>{slider.imgCap}</figcaption>
                                    }
                                </figure>
                            </SwiperSlide>
                        ))
                    }
                </Swiper>
            </SwiperWrapper>
        </TheWrapper>
    );
}

const TheWrapper = styled.section`
height: 100vh;
display: grid;
place-items: center;
position: relative;
overflow: hidden;

&::before {
    content: "";
    width: 100%;
    height: 100%;
    position: absolute;
    margin: auto;
    inset: 0;
    z-index: -1;
    animation: colorful_bg infinite 5s linear;
    opacity: .75;
}

// https://webgradients.com/
@keyframes colorful_bg {
    0% {
        background-image: linear-gradient(to top, #d299c2 0%, #fef9d7 100%);
        transform: rotate(0deg) scale(2.5);
    }

    100% {
        background-image: linear-gradient(to top, #d299c2 0%, #fef9d7 100%);
        transform: rotate(360deg) scale(2.5);
    }
}
`;

const SwiperWrapper = styled.div`
max-width: 320px;
margin: 5em auto;

& img {
    object-fit: cover;
    height: 100%;
}

& .swiper {
    aspect-ratio: 16/9;
}

& .swiper-wrapper {
    gap: 2.5em;

    & .swiper-slide {
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: .4rem;
        color: #fff;

        & figcaption {
            display: none;
        }
        
        &.swiper-slide-active{
            animation: sliderMove 1 .75s ease-in-out;
            position: relative;

            & figcaption {
                display: block;
                position: absolute;
                line-height: 1.8;
                padding-right: 1.5em;
                bottom: 1em;
                left: 1.5em;
                z-index: 1;

                &::before {
                    content: "";
                    width: 100vw;
                    height: 100%;
                    background-color: rgba(0,0,0,.5);
                    position: absolute;
                    bottom: 0;
                    left: -1.5em;
                    z-index: -1;
                }
            }

            &::before,
            &::after {
                content: "";
                width: 100%;
                height: 16px;
                background-color: #f3f3f3;
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
                    background-color: #f3f3f3;
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

    25%{
        filter: blur(8px);
        opacity: 1;
    }

    100%{
        filter:blur(0);
        opacity: 1;
    }
}

@media screen and (min-width: 1025px) {
    max-width: 560px;

    & .swiper-wrapper {
        & .swiper-slide {
            border-radius: 4px;
        }
    }
}
`;