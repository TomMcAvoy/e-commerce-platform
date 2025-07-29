export default function CompanyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="company-layout">
      {children}
    </div>
  );
}