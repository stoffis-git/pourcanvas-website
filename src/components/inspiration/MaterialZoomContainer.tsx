interface Props {
  image: string;
  alt: string;
}

export const MaterialZoomContainer = ({ image, alt }: Props) => {
  if (!image.startsWith("https://")) return null;
  return (
    <div className="w-full aspect-[2/1] rounded-2xl overflow-hidden">
      <img
        src={image}
        alt={alt}
        className="w-full h-full object-cover"
        style={{ objectPosition: "50% 90%" }}
        draggable={false}
      />
    </div>
  );
};
