import { Collection } from "@/components/shared/Collection";
import { navLinks } from "@/constants";
import { getAllImages } from "@/lib/actions/image.actions";
import Image from "next/image";
import Link from "next/link";
import ThemeVideo from "../components/ThemeVideo";

const Home = async ({ searchParams }: SearchParamProps) => {
  const page = Number(searchParams?.page) || 1;
  const searchQuery = (searchParams?.query as string) || "";
  const images = await getAllImages({ page, searchQuery });

  return (
    <>
      <section className="w-full flex justify-center items-center py-2 bg-transparent">
        <ThemeVideo />
      </section>

      <div className="features-container">
        <Link href="/transformations/add/restore" className="text-center">
          <div className="circle-3d">
            <Image src="/assets/icons/restore-3d.png" alt="Image Restore" width={64} height={64} />
          </div>
          <p className="feature-text">Image Restore</p>
        </Link>

        <Link href="/transformations/add/fill" className="text-center">
          <div className="circle-3d">
            <Image src="/assets/icons/Fill-3d.png" alt="Generative Fill" width={64} height={64} />
          </div>
          <p className="feature-text">Generative Fill</p>
        </Link>

        <Link href="/transformations/add/remove" className="text-center">
          <div className="circle-3d">
            <Image src="/assets/icons/remove-3d.png" alt="Object Remove" width={64} height={64} />
          </div>
          <p className="feature-text">Object Remove</p>
        </Link>

        <Link href="/transformations/add/recolor" className="text-center">
          <div className="circle-3d">
            <Image src="/assets/icons/recolor-3d.png" alt="Object Recolor" width={64} height={64} />
          </div>
          <p className="feature-text">Object Recolor</p>
        </Link>

        <Link href="/image-generator" className="text-center">
          <div className="circle-3d">
            <Image src="/assets/icons/generator-3d.png" alt="Image Generator" width={64} height={64} />
          </div>
          <p className="feature-text">Image Generator</p>
        </Link>

        <Link href="/transformations/add/removeBackground" className="text-center">
          <div className="circle-3d">
            <Image src="/assets/icons/back-3d.png" alt="Background Remove" width={64} height={64} />
          </div>
          <p className="feature-text">Background Remove</p>
        </Link>
      </div>

      

      <section className="sm:mt-12">
        <Collection
          images={images?.data}
          totalPages={images?.totalPage}
          page={page}
        />
      </section>
    </>
  );
};

export default Home;