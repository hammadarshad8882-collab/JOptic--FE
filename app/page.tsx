import HomeClient from "@/components/HomeClient";

export default async function HomePage() {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/products/getProducts`,
    {
      next: {
        revalidate: 60,
      },
    },
  );

  const data = await response.json();
  return <HomeClient initialProducts={data.products} />;
}
