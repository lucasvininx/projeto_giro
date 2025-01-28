export default function RegisterLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    return (
      <section className="bg-gray-100 min-h-screen flex flex-col">
        <main className="flex-grow">{children}</main>
      </section>
    )
  }
  
  