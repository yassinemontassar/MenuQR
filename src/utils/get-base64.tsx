import Image from "next/image";
import { getPlaiceholder } from "plaiceholder";

interface BlurProps {
  src: string;
}

export default async function BlurImage({ src }: BlurProps): Promise<JSX.Element> {
  const buffer = await fetch(src).then(async (res) =>
    Buffer.from(await res.arrayBuffer())
  );

  const { base64 } = await getPlaiceholder(buffer);
  return (
    <div>
      <Image
        src={src}
        fill
        alt="image"
        placeholder="blur"
        blurDataURL={base64}
      />
    </div>
  );
}
