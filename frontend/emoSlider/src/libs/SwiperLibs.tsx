import { useEffect, useState } from 'react';

// Import Swiper React components【スワイパー自体の読込】
import { Swiper, SwiperSlide } from 'swiper/react';

// import required modules【使いたい機能】
import { EffectCards, Autoplay } from 'swiper/modules';

type sliderItems = {
    imgSrc: string;
    imgCap?: string;
};

export default function SwiperLibs() {
    const theAry: sliderItems[] = [];
    // PC（Mac）では8枚まで、スマホやPC（Win）では5枚まで（X枚以上はX枚目が何故か重複してうまく挙動しなくなる）
    for (let i = 1; i < 6; i++) {
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
        <section className='TheWrapper h-screen grid place-items-center relative overflow-hidden before:conten-[""] before:w-full before:h-full before:absolute before:m-auto before:inset-[0] before:z-[-1] before:opacity-[.75]'>
            <div className='SwiperWrapper max-w-[20rem] my-[5em] mx-auto lg:max-w-[560px]'>
                <Swiper
                    effect={'cards'}
                    grabCursor={true}
                    autoplay={{
                        delay: 2500
                    }}
                    speed={1000}
                    modules={[EffectCards, Autoplay]}
                    className="theSwiper aspect-video"
                >
                    {sliderItem.length > 0 &&
                        sliderItem.map((slider, i) => (
                            <SwiperSlide key={i} className='flex items-center justify-center rounded text-white'>
                                <figure>
                                    <img className='m-auto object-cover h-full' src={slider.imgSrc} alt="imges" />
                                    {slider.imgCap &&
                                        <figcaption>{slider.imgCap}</figcaption>
                                    }
                                </figure>
                            </SwiperSlide>
                        ))
                    }
                </Swiper>
            </div>
        </section>
    );
}