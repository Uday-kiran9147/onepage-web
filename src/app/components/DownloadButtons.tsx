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
    </div>
  );
}
