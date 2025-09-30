import PublicProfilePage from "@/components/profile/PublicProfilePage";

interface PageProps {
  params: {
    public_id: string;
  };
}

export default function Page({ params }: PageProps) {
  return <PublicProfilePage publicId={params.public_id} />;
}