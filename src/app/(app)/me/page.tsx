import { MyShops } from "@/components/shops/my-shops";
import type { Metadata } from "next";
export const metadata: Metadata = { title: "My shops" };
export default function MyShopsPage() {
  return <MyShops />;
}
