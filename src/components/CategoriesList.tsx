import Carousel from "react-multi-carousel";
import MiniCard from "./MiniCard";
import { Category } from "types";

type Props = {
    categories: Category[];
    selectedCategoryId: number;
    onCategorySelected: (id: number) => void;
};

function CategoriesList({
    categories,
    selectedCategoryId,
    onCategorySelected,
}: Props) {
    const responsive = {
        xxxxl: {
            breakpoint: { max: 1450, min: 1300 },
            items: 5,
            slidesToSlide: 3,
        },
        xxxl: {
            breakpoint: { max: 1300, min: 1170 },
            items: 4,
            slidesToSlide: 2,
            partialVisibilityGutter: 40,
        },
        xxl: {
            breakpoint: { max: 1170, min: 1050 },
            items: 2,
            slidesToSlide: 1,
            partialVisibilityGutter: 4,
        },
        xl: {
            breakpoint: { max: 1080, min: 1020 },
            items: 2,
            slidesToSlide: 1,
            partialVisibilityGutter: 4,
        },
        lg: {
            breakpoint: { max: 1020, min: 850 },
            items: 4,
            slidesToSlide: 1,
            partialVisibilityGutter: 4,
        },
        md: {
            breakpoint: { max: 850, min: 680 },
            items: 2,
            slidesToSlide: 1,
            partialVisibilityGutter: 4,
        },
        sm: {
            breakpoint: { max: 680, min: 0 },
            items: 1,
            slidesToSlide: 1,
            partialVisibilityGutter: 4,
        },
    };

    return (
        <Carousel
            responsive={responsive}
            keyBoardControl={true}
            customTransition="all .5"
            transitionDuration={500}
            containerClass=""
            itemClass="py-24"
            deviceType={""}
            infinite
            arrows
            ssr
            partialVisible={false}
            focusOnSelect={true}
            centerMode={true}
        >
            {categories?.map((cat) => (
                <button key={cat.id} onClick={() => onCategorySelected(cat.id)}>
                    <MiniCard
                        category={cat}
                        selected={selectedCategoryId === cat.id}
                    />
                </button>
            ))}
        </Carousel>
    );
}

export default CategoriesList;
