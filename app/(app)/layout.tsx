import Topo from "@/components/Topo";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Topo />
      <main>{children}</main>
    </>
  );
}
