interface Props {
  image: string;
  alt: string;
}

export const MaterialZoomContainer = ({ image, alt }: Props) => {
  if (!image.startsWith("https://")) return null;
  return (
    <div className="w-full h-48 md:h-56 rounded-2xl overflow-hidden">
      <img
        src={image}
        alt={alt}
        className="w-full h-full object-cover object-bottom"
        draggable={false}
      />
    </div>
  );
};
