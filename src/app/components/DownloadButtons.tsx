import Image from "next/image";

export function DownloadButtons() {
  return (
    <div className="flex flex-wrap items-center gap-4">
      {/* Google Play Button */}
      <a
        href="https://play.google.com/store/apps/details?id=com.onepage.onepage"
        target="_blank"
        rel="noopener noreferrer"
        className="transition-transform hover:scale-105"
      >
        <Image
          src="/Google_Play_Store.png"
          alt="Get it on Google Play"
          width={140}
          height={45}
          className="rounded-md shadow-md"
        />
      </a>

      {/* Indus Appstore Button */}
      <a
        href="https://www.indusappstore.com/apps/books-and-reference/onepage/com.onepage.onepage?page=details&id=com.onepage.onepage"
        target="_blank"
        rel="noopener noreferrer"
        className="transition-transform hover:scale-105"
      >
        <Image
          src="/Indus_Appstore.png"
          alt="Download on Indus Appstore"
          width={140}
          height={45}
          className="rounded-md shadow-md"
        />
      </a>

      {/* ProductHunt Button */}
      <a
        href="https://www.producthunt.com/products/onepage-4?embed=true&utm_source=badge-featured&utm_medium=badge&utm_source=badge-onepage-4"
        target="_blank"
        rel="noopener noreferrer"
        className="transition-transform hover:scale-105"
      >
        <Image
          src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1032480&theme=light&t=1761974106584"
          alt="OnePage - Replace doomscrolling with daily mindful learning | Product Hunt"
          width={200}
          height={54}
          className="rounded-md shadow-md"
        />
      </a>
    </div>
  );
}
