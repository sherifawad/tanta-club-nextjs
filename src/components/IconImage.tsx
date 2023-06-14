import Image from "next/image";
import { RxDashboard } from "react-icons/rx";

type IconImageProps = {
    src?: string | null;
    className?: string;
};

const IconImage = ({ src, className = "" }: IconImageProps) => {
    return (
        <div className={`relative h-4 w-4 overflow-hidden ${className}`}>
            {src == null ? (
                <RxDashboard className="w-full h-full" />
            ) : (
                <Image
                    src={src}
                    alt="Category Image"
                    quality={100}
                    width={50}
                    height={50}
                />
            )}
        </div>
    );
};

export default IconImage;
