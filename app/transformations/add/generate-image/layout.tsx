import RootLayout from "@/app/(root)/layout";

export default function GenerateImageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <RootLayout>{children}</RootLayout>;
}
